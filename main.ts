import { serve } from "https://deno.land/std@0.145.0/http/server.ts";
import scrap from "./utils/scrap.ts";

try {

    serve(() => new Response("OK"));

    const moviesURL = "https://srsku.vercel.app/movies/trending";
    await scrap(moviesURL);

    const seriesURL = "https://srsku.vercel.app/series/trending";
    await scrap(seriesURL);

    Deno.exit(0);
} catch (error) {
    console.log(error.message);
    Deno.exit(1);
}