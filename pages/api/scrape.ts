import { chromium } from "playwright";
import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs'
import { autoScroll } from "@/utils/autoScroll";
import { fetchVisibleItems } from "@/utils/fetchVisibleOffers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = process.env.URL;
  const name = process.env.NAME

  if (!url) {
    return;
  }

  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to a website
    await page.goto(url);

    const pageTitle = await page.title();
    console.log("Page title: ", pageTitle);

    await autoScroll(page);

    const offers = await fetchVisibleItems(page);

    console.log("COLLECTED", offers.length);
    console.log("GET DETAILS");

    console.log("OFFERS");
    console.table(offers);

    await page.screenshot({
      path: `output/screenshot/${name}.png`,
      fullPage: true,
    });

    fs.writeFile(
      `output/offers/${name}${new Date().toISOString()}.json`,
      JSON.stringify({offers}),
      "utf8",
      () => {
        console.log(`Created file with data:, ${new Date().toISOString()}`);
      }
    );

    await browser.close();
    res.status(200).json({ title: pageTitle, content: "Scraping successful" });
  } catch (error) {
    console.error("Scraping failed:", error);
    res.status(500).json({ error: "Scraping failed" });
  }
}
