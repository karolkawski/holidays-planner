import {IConfig} from '@/src/interfaces/IConfig';
import {ISelectorConfig} from '@/src/interfaces/ISelectorConfig';

export type CitysType = Record<CityKey, {phases: string[]; name: string}>;

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

const citys: Record<CityKey, {phases: string[]; name: string}> = {
  gdansk: {
    phases: ['z Gdańska', 'lub Gdańska'],
    name: 'Gdańsk',
  },
  warszawa: {
    phases: ['z Warszawy'],
    name: 'Warszawa',
  },
  poznan: {
    phases: ['z Poznania', 'Poznań'],
    name: 'Poznań',
  },
  krakow: {
    phases: ['z Krakowa', 'Kraków'],
    name: 'Kraków',
  },
} as CitysType;

export type CityKey = 'gdansk' | 'warszawa' | 'poznan' | 'krakow';

export const config: IConfig = {
  version: 'bot', //search | bot
  mode: 'both', //both | db | files
  filters: {
    from: new Date(),
    to: new Date(),
    where: null,
  },
  selectorsConfig,
  scrapper: {
    domains: [
      {
        url: process.env.URL as string,
        type: 'offers',
        rss: false,
        name: process.env.NAME as string,
      },
      {
        url: process.env.URL2 as string,
        type: 'offers',
        rss: false,
        name: process.env.NAME2 as string,
      },
    ],
    citys,
  },
};
