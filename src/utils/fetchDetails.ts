import {IOffer} from '@/src/interfaces/IOffer';
import {BrowserContext, Page} from 'playwright';
import pLimit from 'p-limit';
import {CityKey, CitysType} from '@/app/config';

const limit = pLimit(5);

export async function fetchDetails(offers: IOffer[], vItems: number, context: BrowserContext) {
  await Promise.all(
    offers.map((offer) =>
      limit(async () => {
        const {isSoldout, checked, url} = offer;
        if (isSoldout || checked || !url) {
          return;
        }

        const page = await context.newPage();
        const title = await page.title();
        try {
          await page.goto(url, {timeout: 30000, waitUntil: 'networkidle'});

          if (vItems === 1) {
            await extractOfferDetails1(page, offer, title);
          }
          if (vItems === 2) {
            await extractOfferDetails2(page, offer, title);
          }
        } catch (e) {
          console.error(`❌ [Scraper] Offer processing error: ${url}`, e);
        } finally {
          await page.close();
        }
      })
    )
  );
}

async function extractOfferDetails1(page: Page, offer: IOffer, title: string) {
  try {
    let price = await page.$eval('.promo__price--amount', (el: HTMLElement) => el.textContent);
    const dates = await page.$eval('.promo__dates div div', (el: HTMLElement) => el.textContent);
    const merchantLink = await page.$eval('.promo__buyNow', (el: HTMLElement) => el.getAttribute('href'));
    const merchant = merchantLink ? new URL(merchantLink).hostname : undefined;
    if (!price) {
      const priceMatch = title.match(/(\d+)\s?(PLN|zł)/);
      if (priceMatch) {
        price = priceMatch[0];
      }
    }

    offer.price = price ? Number.parseInt(price?.replace(/(PLN|zł|od)/g, '').trim()) : 0;
    offer.type = 'offer';
    offer.checked = true;
    offer.dates = dates;
    offer.merchant = merchant;
  } catch {
    await extractArticleDetails(page, offer);
  }
}

async function extractOfferDetails2(page: Page, offer: IOffer, title: string) {
  try {
    const price = await page.$eval('.thread-price', (el: HTMLElement) => el.textContent);
    const merchant = await page.$eval('[data-t="merchantLink"]', (el: HTMLElement) => el.textContent);
    const published = await page.$eval('[id="threadDetailPortal"] .color--text-TranslucentSecondary', (el: HTMLElement) => el.textContent);
    offer.price = price ? Number.parseInt(price?.replace(/(PLN|zł|od)/g, '').trim()) : 0;
    offer.type = 'offer';
    offer.checked = true;
    offer.merchant = merchant;
    if (published) offer.published = published;
  } catch {}
}

async function extractArticleDetails(page: Page, offer: IOffer) {
  try {
    const price = await page.$eval('.article__price', (el: HTMLElement) => el.textContent);
    const flightPrice = await page.$eval('.articleSection__price', (el: HTMLElement) => el.textContent);

    offer.type = 'article';
    offer.price = price ? Number.parseInt(price?.replace(/(PLN|zł|od)/g, '').trim()) : 0;
    offer.checked = true;
    offer.flight = flightPrice;
  } catch {
    console.warn(`[Scraper] Additional details not exist: ${offer.url}`);
  }
}

export const getFrom = (title: string | null, citys: CitysType): string => {
  if (!title) {
    return 'undefined';
  }

  const cityKeys = Object.keys(citys) as CityKey[];
  const foundCityKey = cityKeys.find((cityKey) => citys[cityKey].phases.some((phase) => title.includes(phase)));
  return foundCityKey ? citys[foundCityKey].name : '';
};
