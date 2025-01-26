import DateUI from '@/src/UI/DateUI';
import {Accordion, AccordionItem} from '@nextui-org/accordion';
import {IOffer} from '@/src/interfaces/IOffer';
import Offer from '@/src/components/Offer';
import {useEffect, useState} from 'react';

function Offers({
  offers,
  sourceFilter = [],
  cityFilter = [],
  priceFilter = {min: 0, max: 10000},
}: {
  offers: {[date: string]: IOffer[]};
  sourceFilter: string[];
  cityFilter: string[];
  priceFilter: {min: number; max: number};
}) {
  const [filtered, setFiltered] = useState<{[date: string]: IOffer[]} | null>(
    offers
  );

  useEffect(() => {
    if (!offers) return;
    const filteredOffers = Object.entries(offers).reduce(
      (acc, [date, offerArray]) => {
        const filteredBySource = offerArray.filter((offer: IOffer) =>
          sourceFilter.includes(offer.source)
        );

        const filteredByCity = filteredBySource.filter((offer: IOffer) =>
          cityFilter.includes(offer.from)
        );

        const filteredByPrices = filteredByCity.filter((offer: IOffer) => {
          const price = offer.price
            ? Number.parseInt(
                offer.price.replace('PLN', '').replace('od', '').trim()
              )
            : 0;
          return priceFilter.min <= price && priceFilter.max > price;
        });

        if (filteredByPrices.length > 0) {
          acc[date] = filteredByPrices;
        }

        return acc;
      },
      {} as {[date: string]: IOffer[]}
    );

    setFiltered(filteredOffers);
  }, [sourceFilter, cityFilter, priceFilter]);

  if (!offers || typeof offers !== 'object') {
    return <></>;
  }

  return (
    <>
      <Accordion>
        {filtered &&
          Object.entries(filtered).map(([date, offerArray]) => (
            <AccordionItem
              key={date}
              title={<DateUI date={date} />}
              aria-label={`Offers for ${date}`}
            >
              {offerArray &&
                Array.isArray(offerArray) &&
                offerArray.map((offer, index) => (
                  <Offer
                    key={`${offer.url}-${index}`}
                    offer={offer}
                    index={index}
                  />
                ))}
            </AccordionItem>
          ))}
      </Accordion>
    </>
  );
}

export default Offers;
