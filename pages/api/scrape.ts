import { BrowserContext, chromium, Page } from 'playwright';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { autoScroll } from '@/utils/autoScroll';
import { fetchVisibleItems } from '@/utils/fetchVisibleOffers';
import { dataProcessing } from '@/utils/dataProcessing';
import { CitysType, config } from '../../app/config';
import { IConfigDomain } from '@/interfaces/IConfig';
import { IScraperResponseItem } from '@/interfaces/IScraperResponseItem';
import { IOffer } from '@/interfaces/IOffer';
import { fetchDetails } from '@/utils/fetchDetails';
import { getDateFromFileName } from '@/utils/getDateFromFileName';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { offers1, offers2 } = req.query;

  if (!config || !config.scrapper || !config.scrapper.domains) {
    return res.status(400).json({ error: 'Missing confuiguraation' });
  }
  const scrapperCofigs: IConfigDomain[] | [] = config.scrapper.domains;

  const webConfigNo0: IConfigDomain = scrapperCofigs[0];
  const webConfigNo1: IConfigDomain = scrapperCofigs[1];

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const serverUrl = `${protocol}://${host}`;
  console.info(`[Scraper] Offers: ${webConfigNo0.name}: ${offers1} | ${webConfigNo1.name}: ${offers2}`);

  if (!offers1 && !offers2) {
    return res.status(400).json({ error: 'Select any offer.' });
  }

  if ((offers1 && !webConfigNo0) || !webConfigNo0.url) {
    console.error('[Scraper] Error: URL environment variable is not set.');
    return res.status(400).json({ error: 'URL environment variable is not set.' });
  }

  if ((offers2 && !webConfigNo1) || !webConfigNo1.url) {
    console.error('[Scraper] Error: URL2 environment variable is not set.');
    return res.status(400).json({ error: 'URL2 environment variable is not set.' });
  }

  const timestamp = new Date().toISOString();
  const response: {
    title: string;
    status: string;
    date: string;
    offersLength: number;
  }[] = [];

  try {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();

    if (offers1) {
      await start(serverUrl, page, timestamp, response, webConfigNo0, context, {
        vItem: 1,
        citys: config.scrapper.citys,
      });
    }

    if (offers2) {
      await start(serverUrl, page, timestamp, response, webConfigNo1, context, {
        vItem: 2,
        citys: config.scrapper.citys,
      });
    }

    await browser.close();
    console.info('[Scraper] Browser closed successfully.');

    return res.status(200).json(response);
  } catch (error) {
    console.error('[Scraper] Scraping failed:', error);
    return res.status(500).json({ error: 'Scraping failed' });
  }
}

const start = async (
  serverUrl: string,
  page: Page,
  timestamp: string,
  response: IScraperResponseItem[],
  config: IConfigDomain,
  context: BrowserContext,
  options: { vItem: number; citys: CitysType }
) => {
  const { url, name } = config;
  console.info(`[Scraper] Navigating to: ${url}`);
  const { pageTitle, offers } = await scrapeWebsite(page, url, context, options);

  await dataProcessing(offers, name, options.citys);

  await prepareFiles(serverUrl, page, name, timestamp, offers, url);

  response.push({
    title: pageTitle,
    status: 'Scraping successful',
    date: timestamp,
    offersLength: offers.length || 0,
  });
};

const prepareFiles = async (serverUrl: string, page: Page, name: string, timestamp: string, offers: IOffer[], url: string) => {
  console.info('[Scraper] Creating output directories and files...');

  const basePath = `public/output/`;
  fs.mkdirSync(`${basePath}screenshots/${name}`, { recursive: true });
  fs.mkdirSync(`${basePath}offers/${name}`, { recursive: true });
  fs.mkdirSync(`${basePath}raw/${name}`, { recursive: true });

  await page.screenshot({
    path: `${basePath}screenshots/${name}/${timestamp}.jpg`,
    fullPage: true,
  });
  console.info(`[Scraper] Screenshot saved at: ${serverUrl}${basePath}screenshots/${name}/${timestamp}.jpg`);

  const folderPath = `${basePath}offers/${name}`;
  const filePath = `${folderPath}/${timestamp}.json`;

  console.log('🚀 ~ prepareFiles ~ filePath:', filePath);
  const dayDate = getDateFromFileName(timestamp);
  console.log('🚀 ~ prepareFiles ~ day:', dayDate);
  //szukam plikow zawierajacych date
  const files = await fs.promises.readdir(folderPath);

  if (!dayDate) {
    return;
  }

  const filteredFiles = files.filter((file) => {
    return file.includes(dayDate);
  });

  console.log('🚀 ~ filteredFiles ~ filteredFiles:', filteredFiles);

  if (filteredFiles.length > 0) {
    //take offers from all files without duplications by name or url
    console.info(`[Scraper] File from this date exist`);

    for (const file of filteredFiles) {
      const content = await fs.promises.readFile(`${folderPath}/${file}`, 'utf-8');
      const parsedContent = JSON.parse(content).offers || [];
      offers = [...offers, ...parsedContent];
      offers = removeDuplicatesByUrl(offers);
    }

    await fs.promises.writeFile(filePath, JSON.stringify({ offers }, null, 2), 'utf8');
    console.info(`[Scraper] Save merged files`, offers.length || 0);

    for (const file of filteredFiles) {
      console.info(`[Scraper] Remove old files ${folderPath}/${file}`);
      await fs.promises.unlink(`${folderPath}/${file}`);
    }
  } else {
    console.info(`[Scraper] File from this date not exist`);
    await fs.promises.writeFile(filePath, JSON.stringify({ offers }, null, 2), 'utf8');
  }

  const domain = new URL(url).hostname;
  const rawPath = `${basePath}raw/${name}/${domain}.html`;
  const htmlContent = await page.content();

  await fs.writeFileSync(rawPath, htmlContent);

  console.info(`[Scraper] Created file with offer data: ${serverUrl}${filePath}`);
};

const scrapeWebsite = async (page: Page, url: string, context: BrowserContext, options: { vItem: number; citys: CitysType }) => {
  await page.goto(url as string);

  const pageTitle = await page.title();

  await autoScroll(page);

  const offers = await fetchVisibleItems(page, options.vItem);
  await fetchDetails(offers, options.vItem, context);
  return { pageTitle, offers };
};

function removeDuplicatesByUrl(offers: IOffer[]): IOffer[] {
  const uniqueOffers = new Map<string | null, IOffer>();

  offers.forEach((offer) => {
    if (!uniqueOffers.has(offer.url)) {
      uniqueOffers.set(offer.url, offer);
    }
  });

  return Array.from(uniqueOffers.values());
}
