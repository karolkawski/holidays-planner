import { CitysType } from '@/app/config';
import { IOffer } from '@/interfaces/IOffer';
import { formatTime, getFrom } from './helpers/helpers';

export async function dataProcessing(offers: IOffer[], name: string, citys: CitysType): Promise<IOffer[]> {
  const processedOffers: IOffer[] = [];

  offers.forEach((offer) => {
    const { title, published } = offer;
    offer.from = getFrom(`${title}`, citys);
    offer.published = formatTime(published);
    offer.source = name;
    processedOffers.push(offer);
  });

  return processedOffers;
}
