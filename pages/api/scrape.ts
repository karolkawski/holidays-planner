import { chromium, Page } from "playwright";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { autoScroll } from "@/utils/autoScroll";
import { fetchVisibleItems } from "@/utils/fetchVisibleOffers";
import { dataProcessing } from "@/utils/dataProcessing";
import { config } from "../../app/config";
import { IConfigDomain } from "@/types/IConfig";
import { IScraperResponseItem } from "@/types/IScraperResponseItem";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { offers1, offers2 } = req.query;

  if (!config || !config.scrapper || !config.scrapper.domains) {
    return res.status(400).json({ error: "Missing confuiguraation" });
  }
  const scrapperCofigs: IConfigDomain[] | [] = config.scrapper.domains;

  const webConfigNo0: IConfigDomain = scrapperCofigs[0];
  const webConfigNo1: IConfigDomain = scrapperCofigs[1];

  console.log(
    `Offers: ${webConfigNo0.name}: ${offers1} | ${webConfigNo1.name}: ${offers2}`
  );

  if (!offers1 && !offers2) {
    return res.status(400).json({ error: "Select any offer." });
  }

  if ((offers1 && !webConfigNo0) || !webConfigNo0.url) {
    console.error("Error: URL environment variable is not set.");
    return res
      .status(400)
      .json({ error: "URL environment variable is not set." });
  }

  if ((offers2 && !webConfigNo1) || !webConfigNo1.url) {
    console.error("Error: URL2 environment variable is not set.");
    return res
      .status(400)
      .json({ error: "URL2 environment variable is not set." });
  }

  const timestamp = new Date().toISOString();
  let response: {
    title: string;
    status: string;
    date: string;
    offersLength: number;
  }[] = [];

  try {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    });
    const page = await context.newPage();

    if (offers1) {
      await start(page, timestamp, response, webConfigNo0, {
        vItem: 1,
      });
    }

    if (offers2) {
      await start(page, timestamp, response, webConfigNo1, {
        vItem: 2,
      });
    }

    await browser.close();
    console.log("Browser closed successfully.");

    return res.status(200).json(response);
  } catch (error) {
    console.error("Scraping failed:", error);
    return res.status(500).json({ error: "Scraping failed" });
  }
}

const start = async (
  page: Page,
  timestamp: string,
  response: IScraperResponseItem[],
  config: IConfigDomain,
  options: any
) => {
  const { url, name } = config;
  console.log(`Navigating to: ${url}`);
  const {pageTitle, offers} = await scrapeWebsite(page, url, options);

  await dataProcessing(offers);

  await prepareFiles(page, name, timestamp, offers);

  response.push({
    title: pageTitle,
    status: "Scraping successful",
    date: timestamp,
    offersLength: offers.length || 0,
  });
};

const prepareFiles = async (
  page: Page,
  name: string,
  timestamp: string,
  offers: any
) => {
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
};


const scrapeWebsite = async (page: Page, url: string, options: any) => {
  await page.goto(url as string);

  const pageTitle = await page.title();
  console.log("Page title:", pageTitle);

  await autoScroll(page);

  const offers = await fetchVisibleItems(page, options.vItems);
  console.log(`Collected ${offers.length} offers.`);
  return {pageTitle, offers}
}