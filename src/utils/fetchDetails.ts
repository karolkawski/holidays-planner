import {IOffer} from '@/src/interfaces/IOffer';
import {BrowserContext, Page} from 'playwright';
import pLimit from 'p-limit';

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
        try {
          await page.goto(url, {timeout: 30000, waitUntil: 'networkidle'});

          if (vItems === 1) {
            await extractOfferDetails1(page, offer);
          }
          if (vItems === 2) {
            await extractOfferDetails2(page, offer);
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

async function extractOfferDetails1(page: Page, offer: IOffer) {
  try {
    const price = await page.$eval('.promo__price--amount', (el: HTMLElement) => el.textContent);
    const dates = await page.$eval('.promo__dates div div', (el: HTMLElement) => el.textContent);

    offer.price = price;
    offer.type = 'offer';
    offer.checked = true;
    offer.dates = dates;
    offer.merchant = undefined;
  } catch {
    await extractAlternativeDetails(page, offer);
  }
}

async function extractOfferDetails2(page: Page, offer: IOffer) {
  try {
    offer.price = await page.$eval('.thread-price', (el: HTMLElement) => el.textContent);
    offer.type = 'offer';
    offer.checked = true;
    offer.merchant = await page.$eval('[data-t="merchantLink"]', (el: HTMLElement) => el.textContent);
  } catch {}
}

async function extractAlternativeDetails(page: Page, offer: IOffer) {
  try {
    const price = await page.$eval('.article__price', (el: HTMLElement) => el.textContent);
    const flightPrice = await page.$eval('.articleSection__price', (el: HTMLElement) => el.textContent);

    offer.type = 'offer';
    offer.price = price;
    offer.checked = true;
    offer.flight = flightPrice;
  } catch {
    console.warn(`[Scraper] Additional details not exist: ${offer.url}`);
  }
}
