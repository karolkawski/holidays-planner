import { IOffer } from '@/interfaces/IOffer';
import { ISelectorConfig } from '@/interfaces/ISelectorConfig';
import { Page } from 'playwright';

export async function fetchVisibleItems(page: Page, type: number): Promise<IOffer[]> {
  const selectors = selectorsConfig[type];
  if (!selectors) {
    throw new Error(`Unsupported type: ${type}`);
  }

  return await page.$$eval(
    selectors.baseSelector,
    (offers, selectors) => {
      const data: IOffer[] = [];

      offers.forEach((product) => {
        try {
          const isOffer = selectors.isOfferHandler ? !!product.querySelector(selectors.isOfferHandler) : true;

          const isSoldout = selectors.isSoldOutHandler ? !!product.querySelector(selectors.isSoldOutHandler) : false;

          const titleElement = selectors.titleHandler ? product.querySelector(selectors.titleHandler) : null;

          const title = titleElement ? titleElement.textContent : null;

          const published = selectors.publishedHandler
            ? selectors.baseSelector === '.item'
              ? product.querySelector(selectors.publishedHandler)?.getAttribute('title')
              : product.querySelector(selectors.publishedHandler)?.textContent
            : null;

          const urlElement = selectors.urlHandler ? product.querySelector(selectors.urlHandler) : titleElement;

          const url = urlElement ? urlElement.getAttribute('href') : null;

          const price = selectors.priceHandler ? product.querySelector(selectors.priceHandler)?.textContent : null;

          if (isOffer && title && published && url) {
            data.push({
              isSoldout,
              title,
              published,
              url,
              checked: false,
              from: '',
              merchant: '',
              source: '',
              price: price || null,
            });
          }
        } catch (error) {
          console.warn('[Scraper] Error while processing product data:', error);
        }
      });

      return data;
    },
    selectors
  );
}

const selectorsConfig: Record<number, ISelectorConfig> = {
  1: {
    baseSelector: '.item',
    isOfferHandler: '.item__header .item__price',
    isSoldOutHandler: '.item__header .item__soldout',
    titleHandler: '.item__content .item__title',
    publishedHandler: '.item__content .item__date',
    urlHandler: '.item__content .item__title a',
    priceHandler: null,
  },
  2: {
    baseSelector: 'article',
    isOfferHandler: null,
    isSoldOutHandler: null,
    titleHandler: '.threadGrid-title a',
    publishedHandler: '.threadGrid-headerMeta .text--b',
    urlHandler: '.threadGrid-title a',
    priceHandler: '.threadItemCard-price',
  },
};
