import {chromium} from 'playwright';
import {NextRequest, NextResponse} from 'next/server';
import fs from 'fs';
import {autoScroll} from '@/src/utils/autoScroll';
import {fetchVisibleItems} from '@/src/utils/fetchVisibleOffers';
import {dataProcessing} from '@/src/utils/dataProcessing';
import {config} from '../../config';
import {IConfigDomain} from '@/src/interfaces/IConfig';
import {IOffer} from '@/src/interfaces/IOffer';
import {fetchDetails} from '@/src/utils/fetchDetails';
import {getDateFromFileName} from '@/src/utils/dates';
import {IPrepareFiles, IRunProcess, IScrapeWebsite} from '@/src/interfaces/IProcess';

export async function POST(req: NextRequest) {
  const {offers1, offers2} = await req.json();

  if (!config || !config.scrapper || !config.scrapper.domains) {
    return NextResponse.json({error: 'Missing confuiguraation'}, {status: 400});
  }
  const scrapperCofigs: IConfigDomain[] | [] = config.scrapper.domains;

  const webConfigNo0: IConfigDomain = scrapperCofigs[0];
  const webConfigNo1: IConfigDomain = scrapperCofigs[1];

  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('host');
  const serverUrl = `${protocol}://${host}`;
  console.info(`[Scraper] Offers: ${webConfigNo0.name}: ${offers1} | ${webConfigNo1.name}: ${offers2}`);

  if (!offers1 && !offers2) {
    return NextResponse.json({error: 'Select any offer.'}, {status: 400});
  }

  if ((offers1 && !webConfigNo0) || !webConfigNo0.url) {
    console.error('❌ [Scraper] Error: URL environment variable is not set.');
    return NextResponse.json({error: 'URL environment variable is not set.'}, {status: 400});
  }

  if ((offers2 && !webConfigNo1) || !webConfigNo1.url) {
    console.error('❌ [Scraper] Error: URL2 environment variable is not set.');
    return NextResponse.json({error: 'URL2 environment variable is not set.'}, {status: 400});
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
      await runProcess({
        serverUrl,
        page,
        timestamp,
        response,
        config: webConfigNo0,
        context,
        options: {
          vItem: 1,
          citys: config.scrapper.citys,
        },
      });
    }

    if (offers2) {
      await runProcess({
        serverUrl,
        page,
        timestamp,
        response,
        config: webConfigNo1,
        context,
        options: {
          vItem: 2,
          citys: config.scrapper.citys,
        },
      });
    }

    await browser.close();
    console.info('[Scraper] Browser closed successfully.');

    return NextResponse.json(response, {status: 200});
  } catch (error) {
    console.error('❌ [Scraper] Scraping failed:', error);
    return NextResponse.json({error: 'Scraping failed'}, {status: 400});
  }
}

const runProcess = async ({serverUrl, page, timestamp, response, config, context, options}: IRunProcess) => {
  const {url, name} = config;
  console.info(`✅ [Scraper] Navigating to: ${url}`);
  const {pageTitle, offers} = await scrapeWebsite({page, url, context, options});

  await dataProcessing(offers, name, options.citys);

  await prepareFiles({serverUrl, page, name, timestamp, offers, url});

  const resp = await fetch('http://localhost:3000/api/offer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(offers),
  });

  if (!resp.ok) {
    throw new Error('Failed to send data to the server');
  }

  console.info(`[Scraper] Fetch today offers from files and stored in DB`);
  response.push({
    title: pageTitle,
    status: 'Scraping successful',
    date: timestamp,
    offersLength: offers.length || 0,
  });
};

const prepareFiles = async ({serverUrl, page, name, timestamp, offers, url}: IPrepareFiles) => {
  console.info('[Scraper] Creating output directories and files...');

  const basePath = `src/public/output/`;
  fs.mkdirSync(`${basePath}screenshots/${name}`, {recursive: true});
  fs.mkdirSync(`${basePath}offers/${name}`, {recursive: true});
  fs.mkdirSync(`${basePath}raw/${name}`, {recursive: true});

  await page.screenshot({
    path: `${basePath}screenshots/${name}/${timestamp}.jpg`,
    fullPage: true,
  });
  console.info(`✅ [Scraper] Screenshot saved at: ${serverUrl}${basePath}screenshots/${name}/${timestamp}.jpg`);

  const folderPath = `${basePath}offers/${name}`;
  const filePath = `${folderPath}/${timestamp}.json`;

  const dayDate = getDateFromFileName(timestamp);
  const files = await fs.promises.readdir(folderPath);

  if (!dayDate) {
    return;
  }

  const filteredFiles = files.filter((file) => {
    return file.includes(dayDate);
  });

  if (filteredFiles.length > 0) {
    //take offers from all files without duplications by name or url
    console.info(`[Scraper] File from this date exist`);

    for (const file of filteredFiles) {
      const content = await fs.promises.readFile(`${folderPath}/${file}`, 'utf-8');
      const parsedContent = JSON.parse(content).offers || [];
      offers = [...offers, ...parsedContent];
      offers = removeDuplicatesByUrl(offers);
    }

    await fs.promises.writeFile(filePath, JSON.stringify({offers}, null, 2), 'utf8');
    console.info(`✅ [Scraper] Save merged files`, offers.length || 0);

    for (const file of filteredFiles) {
      console.info(`[Scraper] Remove old files ${folderPath}/${file}`);
      await fs.promises.unlink(`${folderPath}/${file}`);
    }
  } else {
    console.info(`[Scraper] File from this date not exist`);
    await fs.promises.writeFile(filePath, JSON.stringify({offers}, null, 2), 'utf8');
  }

  const domain = new URL(url).hostname;
  const rawPath = `${basePath}raw/${name}/${domain}.html`;
  const htmlContent = await page.content();

  await fs.writeFileSync(rawPath, htmlContent);

  console.info(`✅ [Scraper] Created file with offer data: ${serverUrl}${filePath}`);
};

const scrapeWebsite = async ({page, url, context, options}: IScrapeWebsite) => {
  await page.goto(url as string);

  const pageTitle = await page.title();

  await autoScroll(page);

  const offers = await fetchVisibleItems(page, options.vItem);
  await fetchDetails(offers, options.vItem, context);
  return {pageTitle, offers};
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
