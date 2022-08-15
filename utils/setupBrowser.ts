import { LaunchOptions, puppeteer } from "../deps.ts";

async function setupBrowser(options?: LaunchOptions) {
    const browser = await puppeteer.launch({
        ...options,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--window-size=1920,1080"
        ],
        headless: true
    });

    const page = (await browser.pages())[0];
    await page.setViewport({ width: 1920, height: 1080 });

    return { page, browser }
}

export default setupBrowser