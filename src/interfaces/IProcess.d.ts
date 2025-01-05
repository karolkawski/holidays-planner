export interface IResult {
  files: {offers: string[]; screenshots: string[]};
  offers: Record<string, IOffer[]>;
  screenshots: Record<string, string[]>;
}

export interface IProcessOffers {
  offersMainDir: string;
  names: string[];
  date: string | null;
  result: IResult;
}

export interface IProcessScreeshots {
  screenshotsMainDir: string;
  names: string[];
  date: string | null;
  result: IResult;
}

export interface IProcessFolder {
  mainDir: string;
  folderName: string;
  date: {from: string; to: string} | null;
  fileProcessor: (fileDate: string, fileName: string, folderPath: string) => Promise<void>;
}

export interface IPrepareFiles {
  serverUrl: string;
  page: Page;
  name: string;
  timestamp: string;
  offers: IOffer[];
  url: string;
}

export interface IScrapeWebsite {
  page: Page;
  url: string;
  context: BrowserContext;
  options: {vItem: number; citys: CitysType};
}

export interface IRunProcess {
  serverUrl: string;
  page: Page;
  timestamp: string;
  response: IScraperResponseItem[];
  config: IConfigDomain;
  context: BrowserContext;
  options: {vItem: number; citys: CitysType};
}
