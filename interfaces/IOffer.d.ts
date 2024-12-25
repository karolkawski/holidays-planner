export interface IOffer {
  source: string;
  isSoldout: number | boolean;
  title: string | number | null;
  published: string | null;
  url: string | nnull;
  checked: boolean;
  merchant: string | null | undefined;
  price?: string | null | undefined;
  type?: string;
  dates?: string | null;
  flight?: string | null;
  from: string;
}
