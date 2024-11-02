export interface IOffer {
    isSoldout: number,
    title: string,
    added: string,
    checked: boolean
    url: string,
    price: string | null | undefined,
    type: string
    dates: string | null
    flight: string| ull
}

export interface IOfferVisibled {
  isSoldout: number | boolean;
  title: string | number | null;
  added: string | number | null;
  url: string | number | null;
  checked: boolean;
}