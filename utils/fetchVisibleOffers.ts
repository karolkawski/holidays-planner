import { IOffer } from "@/types/IOffer";
import { Page } from "playwright";

export async function fetchVisibleItems(
  page: Page,
  type: number
): Promise<IOffer[]> {
  if (type === 1) {
    return page.$$eval(".item", (offers) => {
      const data: IOffer[] = [];

      offers.forEach((product) => {
        try {
          const isOffer = !!product.querySelector(".item__header .item__price");
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
          const published = addedElement
            ? addedElement.getAttribute("title")
            : null;

          const urlElement = product.querySelector(
            ".item__content .item__title a"
          );
          const url = urlElement ? urlElement.getAttribute("href") : null;

          if (isOffer && title && published && url) {
            data.push({
              isSoldout,
              title,
              published,
              url,
              checked: false,
              from: "",
            });
          }
        } catch (error) {
          console.warn("Error while fetching product data:", error);
        }
      });

      return data;
    });
  } else {
    return page.$$eval("article", (offers) => {
      const data: IOffer[] = [];

      offers.forEach((product) => {
        try {
          const isOffer = true;
          const isSoldout = false;
          const titleElement = product.querySelector(".threadGrid-title a");
          const title = titleElement ? titleElement.textContent : null;

          const published = product.querySelector(
            ".threadGrid-headerMeta .text--b"
          )?.textContent;

          const urlElement = titleElement;
          const url = urlElement ? urlElement.getAttribute("href") : null;

          if (isOffer && title && published && url) {
            data.push({
              isSoldout,
              title,
              published,
              url,
              checked: false,
              from: "",
            });
          }
        } catch (error) {
          console.warn("Error while fetching product data:", error);
        }
      });
      return data;
    });
  }
}
