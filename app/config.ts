import { IConfig } from "@/types/IConfig";



export const config = {
  mode: "bot", //search | bot
  filters: {
    from: new Date(),
    to: new Date(),
    where: null,
  },
  scrapper: {
    domains: [
      {
        url: process.env.URL,
        type: "offers",
        rss: false,
        name: process.env.NAME,
      },
      {
        url: process.env.URL2,
        type: "offers",
        rss: false,
        name: process.env.NAME2,
      },
    ],
  },
} as IConfig;
