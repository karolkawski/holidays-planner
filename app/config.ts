import { IConfig } from '@/interfaces/IConfig';

export type CitysType = Record<CityKey, { phases: string[]; name: string }>;

const citys: Record<CityKey, { phases: string[]; name: string }> = {
  gdansk: {
    phases: ['z Gdańska', 'lub Gdańska'],
    name: 'Gdańsk',
  },
  warszawa: {
    phases: ['z Warszawy'],
    name: 'Warszawa',
  },
} as CitysType;

export type CityKey = 'gdansk' | 'warszawa';

export const config: IConfig = {
  mode: 'bot', //search | bot
  filters: {
    from: new Date(),
    to: new Date(),
    where: null,
  },
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
