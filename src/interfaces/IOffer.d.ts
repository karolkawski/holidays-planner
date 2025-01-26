export interface IOffer {
  source: string;
  isSoldout: number | boolean;
  title: string | number | null;
  published: string | null;
  scrapped: string;
  url: string | null;
  checked: boolean;
  merchant: string | null | undefined;
  price?: number;
  type?: string;
  dates?: string | null;
  flight?: string | null;
  from: string;
}
