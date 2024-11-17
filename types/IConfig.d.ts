export interface IConfig {
  mode: string;
  filters: {
    from: Date;
    to: Date;
    where: string | null;
  };
  scrapper: {
    domains: IConfigDomain[];
  };
}



export interface IConfigDomain {
    url: string
    type: 'offers'
    rss: boolean
    name: string
}