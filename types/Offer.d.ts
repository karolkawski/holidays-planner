export interface IOffer {
  isSoldout: number | boolean;
  title: string | number | null;
  added: string | number | null;
  url: string | nnull;
  checked: boolean;
  price?: string | null | undefined;
  type?: string;
  dates?: string | null;
  flight?: string | null;
  from: string
}