import {CitysType} from '@/app/config';
import {IOffer} from '@/src/interfaces/IOffer';
import {formatTime} from '@/src/utils/dates';
import {getFrom} from './fetchDetails';

export async function dataProcessing(offers: IOffer[], name: string, citys: CitysType): Promise<IOffer[]> {
  const processedOffers: IOffer[] = [];

  offers.forEach((offer) => {
    const {title, published} = offer;
    offer.from = getFrom(`${title}`, citys);
    offer.published = formatTime(published);
    offer.source = name;
    processedOffers.push(offer);
  });

  return processedOffers;
}
