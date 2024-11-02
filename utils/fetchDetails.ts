import { IOffer } from "@/types/Offer";
import { BrowserContext } from "playwright";

export async function fetchDetails(offers: IOffer[], context: BrowserContext) {
  await Promise.all(
    offers.map(async (offer) => {
      const { isSoldout, checked, url } = offer;
      if (isSoldout || checked || !url) {
        return false;
      }
      const page = await context.newPage();

      try {
        await page.goto(url, {
          timeout: 30000,
          waitUntil: "networkidle",
        });

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
          // offer.tags = tags;
        } catch {
          offer.checked = true;
          offer.price = undefined;
          offer.type = "article";
        }

        if (!offer.price) {
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
            return;
          }
        }
      } catch (e) {
        console.error("Timeout 30000ms exceeded", e);
      }
    })
  );
}
