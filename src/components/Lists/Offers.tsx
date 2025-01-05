import DateUI from '@/src/UI/DateUI';
import {Accordion, AccordionItem} from '@nextui-org/accordion';
import {IOffer} from '@/src/interfaces/IOffer';
import Offer from '@/src/components/Offer';
import {useEffect, useState} from 'react';

function Offers({offers, sourceFilter = []}: {offers: {[date: string]: IOffer[]}; sourceFilter: string[]}) {
  const [filtered, setFiltered] = useState<{[date: string]: IOffer[]} | null>(null);

  useEffect(() => {
    if (!offers || typeof offers !== 'object') return;

    const filteredOffers = Object.entries(offers).reduce(
      (acc, [date, offerArray]) => {
        if (!Array.isArray(offerArray)) return acc;

        const filteredArray = offerArray.filter((offer: IOffer) => !sourceFilter.length || sourceFilter.includes(offer.source));

        if (filteredArray.length > 0) {
          acc[date] = filteredArray;
        }

        return acc;
      },
      {} as {[date: string]: IOffer[]}
    );
    if (JSON.stringify(filteredOffers) !== JSON.stringify(filtered)) {
      setFiltered(filteredOffers);
    }
  }, [offers, sourceFilter, filtered]);

  if (!offers || typeof offers !== 'object') {
    return <></>;
  }

  const dataToRender = filtered || offers;

  return (
    <Accordion>
      {dataToRender &&
        Object.entries(dataToRender).map(([date, offerArray]) => (
          <AccordionItem key={date} title={<DateUI date={date} />} aria-label={`Offers for ${date}`}>
            {offerArray && Array.isArray(offerArray) && offerArray.map((offer, index) => <Offer key={`${offer.url}-${index}`} offer={offer} index={index} />)}
          </AccordionItem>
        ))}
    </Accordion>
  );
}

export default Offers;
