import { CitysType } from '@/app/config';

export interface IConfig {
  mode: string;
  filters: {
    from: Date;
    to: Date;
    where: string | null;
  };
  scrapper: {
    domains: IConfigDomain[];
    citys: CitysType;
  };
}

export interface IConfigDomain {
  url: string;
  type: 'offers';
  rss: boolean;
  name: string;
}
