import { IOffer } from "@/types/Offer";
import { BrowserContext, Page } from "playwright";
import pLimit from "p-limit";

const limit = pLimit(5);

export async function fetchDetails(offers: IOffer[], context: BrowserContext) {
  await Promise.all(
    offers.map((offer) =>
      limit(async () => {
        const { isSoldout, checked, url } = offer;
        if (isSoldout || checked || !url) {
          return;
        }

        const page = await context.newPage();
        try {
          await page.goto(url, { timeout: 30000, waitUntil: "networkidle" });

          await extractOfferDetails(page, offer);
        } catch (e) {
          console.error(`Offer processing error: ${url}`, e);
        } finally {
          await page.close(); 
        }
      })
    )
  );
}

async function extractOfferDetails(page: Page, offer: IOffer) {
  try {
    const price = await page.$eval(
      ".promo__price--amount",
      (el: HTMLElement) => el.textContent
    );
    const dates = await page.$eval(
      ".promo__dates div div",
      (el: HTMLElement) => el.textContent
    );

    offer.price = price;
    offer.type = "offer";
    offer.checked = true;
    offer.dates = dates;
  } catch {
    offer.checked = true;
    offer.type = "article";
    offer.price = undefined;

    await extractAlternativeDetails(page, offer);
  }
}

async function extractAlternativeDetails(page: Page, offer: IOffer) {
  try {
    const price = await page.$eval(
      ".article__price",
      (el: HTMLElement) => el.textContent
    );
    const flightPrice = await page.$eval(
      ".articleSection__price",
      (el: HTMLElement) => el.textContent
    );

    offer.type = "offer";
    offer.price = price;
    offer.checked = true;
    offer.flight = flightPrice;
  } catch {
    console.warn(
      `Additional details not exist: ${offer.url}`
    );
  }
}
