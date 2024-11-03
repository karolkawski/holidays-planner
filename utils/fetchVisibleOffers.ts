import { IOffer } from "@/types/Offer";
import { Page } from "playwright";

export async function fetchVisibleItems(page: Page): Promise<IOffer[]> {
  return page.$$eval(".item", (allProducts) => {
    const data: IOffer[] = [];

    allProducts.forEach((product) => {
      try {
        const isSoldout = !!product.querySelector(
          ".item__header .item__soldout"
        );
        const titleElement = product.querySelector(
          ".item__content .item__title"
        );
        const title = titleElement ? titleElement.textContent : null;

        const addedElement = product.querySelector(
          ".item__content .item__date"
        );
        const added = addedElement ? addedElement.getAttribute("title") : null;

        const urlElement = product.querySelector(
          ".item__content .item__title a"
        );
        const url = urlElement ? urlElement.getAttribute("href") : null;

        if (title && added && url) {
          data.push({ isSoldout, title, added, url, checked: false });
        }
      } catch (error) {
        console.warn("Error while fetching product data:", error);
      }
    });

    return data;
  });
}
