import DateUI from './UI/DateUI';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { IOffer } from '@/interfaces/IOffer';
import Offer from './Offer';
import { useEffect, useState } from 'react';

function OffersList({ offers, sourceFilter }: { offers: IOffer[]; sourceFilter: string[] }) {
  const [filtered, setFiltered] = useState<{ [date: string]: IOffer[] } | null>(null);

  if (!offers) {
    return;
  }

  useEffect(() => {
    if (!offers) return;
    const filteredOffers = Object.entries(offers).reduce(
      (acc, [date, offerArray]) => {
        const filteredArray = offerArray.filter((offer: IOffer) => sourceFilter.includes(offer.source));
        if (filteredArray.length > 0) {
          acc[date] = filteredArray;
        }
        return acc;
      },
      {} as { [date: string]: IOffer[] }
    );

    setFiltered(filteredOffers);
  }, [offers, sourceFilter]);

  return (
    <Accordion>
      {Object.entries(filtered || offers).map(([date, offerArray]) => (
        <AccordionItem key={date} title={<DateUI date={date} />} aria-label={`Offers for ${date}`}>
          {offerArray && Array.isArray(offerArray) && offerArray.map((offer, index) => <Offer key={index} offer={offer} index={index} />)}
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default OffersList;
