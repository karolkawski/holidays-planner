import { IOfferVisibled } from "@/types/Offer";
import { Page } from "playwright";

export async function fetchVisibleItems(page: Page) {
  return page.$$eval(".item", (all_products) => {
    const data: IOfferVisibled[] = [];
    all_products.forEach((product) => {
      const isSoldout =
        !!product.querySelector(".item__header .item__soldout") || 0;
      const title = product.querySelector(".item__content .item__title")
        ? product.querySelector(".item__content .item__title")!.textContent
        : 0;
      const added = product.querySelector(".item__content .item__date")
        ? product
            .querySelector(".item__content .item__date")!
            .getAttribute("title")
        : 0;
      const url = product.querySelector(".item__content .item__title a")
        ? product
            .querySelector(".item__content .item__title a")!
            .getAttribute("href")
        : 0;
      if (isSoldout === 0 && title === 0 && added === 0 && url === 0) {
        return;
      }
      data.push({ isSoldout, title, added, url, checked: false });
    });
    return data;
  });
}
