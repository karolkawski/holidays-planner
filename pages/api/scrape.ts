import { chromium } from "playwright";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { autoScroll } from "@/utils/autoScroll";
import { fetchVisibleItems } from "@/utils/fetchVisibleOffers";
import { fetchDetails } from "@/utils/fetchDetails";
import { dataProcessing } from "@/utils/dataProcessing";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = process.env.URL;
  const name = process.env.NAME;

  if (!url) {
    console.error("Error: URL environment variable is not set.");
    return res
      .status(400)
      .json({ error: "URL environment variable is not set." });
  }

  const timestamp = new Date().toISOString();

  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the website
    console.log(`Navigating to: ${url}`);
    await page.goto(url);

    const pageTitle = await page.title();
    console.log("Page title:", pageTitle);

    await autoScroll(page);

    const offers = await fetchVisibleItems(page);
    console.log(`Collected ${offers.length} offers.`);

    console.log("Fetching details for collected offers...");
    await fetchDetails(offers, context);
    console.log("Details fetching complete.");

    await dataProcessing(offers);
    
    console.log("Creating output directories and files...");
    fs.mkdirSync(`public/output/screenshots`, { recursive: true });
    fs.mkdirSync(`public/output/offers`, { recursive: true });

    await page.screenshot({
      path: `public/output/screenshots/${name}_${timestamp}.jpg`,
      fullPage: true,
    });
    console.log(
      `Screenshot saved at: public/output/screenshots/${name}_${timestamp}.jpg`
    );

    const filePath = `public/output/offers/${name}_${timestamp}.json`;
    await fs.promises.writeFile(
      filePath,
      JSON.stringify({ offers }, null, 2),
      "utf8"
    );
    console.log(`Created file with offer data: ${filePath}`);

    await browser.close();
    console.log("Browser closed successfully.");
    return res.status(200).json({
      title: pageTitle,
      status: "Scraping successful",
      date: timestamp,
      offersLength: offers.length || 0,
    });
  } catch (error) {
    console.error("Scraping failed:", error);
    return res.status(500).json({ error: "Scraping failed" });
  }
}
