'use client';

import { useEffect, useState } from 'react';
import { IOffer } from '@/interfaces/IOffer';
import Datalist from './OffersList';
import { IConfig } from '@/interfaces/IConfig';

function ListWrapper({ config, sourceFilter }: { config: IConfig; sourceFilter: string[] }) {
  const [files, setFiles] = useState<{
    offers: string[] | null;
    screenshots: string[] | null;
  } | null>(null);
  const [offers, setOffers] = useState<{ [date: string]: IOffer[] } | null>(null);
  const [filtered, setFiltered] = useState<{ [date: string]: IOffer[] } | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  async function fetchOffers() {
    try {
      const names = [config.scrapper.domains[0].name, config.scrapper.domains[1].name];
      const response = await fetch(`/api/offers?name=${encodeURIComponent(JSON.stringify(names))}`);
      const result = await response.json();

      const { files, offers } = result;
      setFiles(files);
      setOffers(offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
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

  if (!files && !offers) {
    return <div>Loading...</div>;
  }

  return <>{offers && <Datalist offers={filtered || offers} />}</>;
}

export default ListWrapper;
