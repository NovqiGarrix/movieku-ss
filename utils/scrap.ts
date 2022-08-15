// deno-lint-ignore-file no-explicit-any
import { configAsync } from '../deps.ts';
import setupBrowser from './setupBrowser.ts';

const ENV = await configAsync();

export default async function scrap(url: string): Promise<void> {

    try {

        const { browser, page } = await setupBrowser();

        await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

        const urls = await page.evaluate(() => {
            const urls = Array.from(document.querySelectorAll('[class=mb-5]'), (item: any) => item.href as string);
            return urls;
        });

        const FOLDER_ID = Deno.env.get("FOLDER_ID") || ENV.FOLDER_ID;

        console.log(`FOUND ${urls.length} URLS`);

        for await (const url of urls) {
            console.log(url);

            await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

            const filename = `./screenshots/${url.split('/')[4]}`;

            await page.screenshot({ path: `${filename}.png` });

            const formData = new FormData();
            const file = new File([`${filename}.png`], filename, { type: "image/png" });

            formData.append("file", file);

            const DRIVE_SERVICE_URL = Deno.env.get("DRIVE_SERVICE_URL") || ENV.DRIVE_SERVICE_URL;
            const fetchURL = `${DRIVE_SERVICE_URL}/api/v1/upload?folderId=${FOLDER_ID}`;

            const resp = await fetch(fetchURL, {
                method: "POST",
                body: formData,
            })

            const { data } = await resp.json();

            if (data.id) {
                console.log(`${filename} uploaded to Google Drive`);
            } else {
                throw new Error(data.error);
            }

        }

        console.log(`✅ ALL URLS SCRAPED. CLOSING BROWSER 🚀`);
        await browser.close();

        console.log(`✅ DELETING ALL PREVIOUS SCREENSHOTS 🚀`);
        await Deno.remove("./screenshots", { recursive: true });

    } catch (error) {
        console.error(error, "Scrap error");
        throw new Error(error.message);
    }

}