import {useEffect, useState} from 'react';
import {IOffer} from '@/src/interfaces/IOffer';
import Offers from '@/src/components/Lists/Offers';
import {IConfig} from '@/src/interfaces/IConfig';
import {CalendarDate} from '@nextui-org/react';
import {parseFromCalendarToDate} from '@/src//utils/dates';

function ListWrapper({config, sourceFilter, date}: {config: IConfig; sourceFilter: string[]; date: {from: CalendarDate; to: CalendarDate}}) {
  const [files, setFiles] = useState<{
    offers: string[] | null;
    screenshots: string[] | null;
  } | null>(null);
  const [offers, setOffers] = useState<{[date: string]: IOffer[]} | null>(null);
  const [filtered, setFiltered] = useState<{[date: string]: IOffer[]} | null>(null);

  useEffect(() => {
    fetchOffers();
  }, [date]);

  async function fetchOffers() {
    try {
      const scrapperData = config.scrapper;
      const [domain1, domain2] = scrapperData.domains;
      const names = [domain1.name, domain2.name];
      const nameFilter = encodeURIComponent(JSON.stringify(names));
      const days = {
        from: parseFromCalendarToDate(date, 'from'),
        to: parseFromCalendarToDate(date, 'to'),
      };
      const encodedDays = encodeURIComponent(JSON.stringify(days));
      let reqUrl = `/api/history?name=${nameFilter}`;
      if (date) reqUrl += `&date=${encodedDays}`;
      const response = await fetch(reqUrl);
      const result = await response.json();
      const {files, offers} = result;
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
      {} as {[date: string]: IOffer[]}
    );

    setFiltered(filteredOffers);
  }, [offers, sourceFilter]);

  if (!files && !offers) {
    return <div>Loading...</div>;
  }

  return <>{offers && <Offers offers={filtered || offers} sourceFilter={sourceFilter} />}</>;
}

export default ListWrapper;
