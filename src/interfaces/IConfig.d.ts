import {CitysType} from '@/app/config';

export interface IConfig {
  mode: string;
  version: string;
  filters: {
    from: Date;
    to: Date;
    where: string | null;
  };
  selectorsConfig: Record<number, ISelectorConfig>;
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
