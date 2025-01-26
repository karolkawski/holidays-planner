import {useEffect, useState} from 'react';
import {IOffer} from '@/src/interfaces/IOffer';
import Offers from '@/src/components/Lists/Offers';
import {IConfig} from '@/src/interfaces/IConfig';
import {CalendarDate, Spinner} from '@nextui-org/react';
import {parseFromCalendarToDate} from '@/src//utils/dates';

function ListWrapper({
  config,
  sourceFilter,
  date,
  priceFilter,
  cityFilter,
}: {
  config: IConfig;
  sourceFilter: string[];
  cityFilter: string[];
  priceFilter: {min: number; max: number};
  date: {from: CalendarDate; to: CalendarDate};
}) {
  const [files, setFiles] = useState<{
    offers: string[] | null;
    screenshots: string[] | null;
  } | null>(null);
  const [offers, setOffers] = useState<{[date: string]: IOffer[]} | null>(null);

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

  if (!files && !offers) {
    return (
      <div className="flex flex-col justify-center items-center mt-10">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {offers && (
        <Offers
          offers={offers}
          sourceFilter={sourceFilter}
          cityFilter={cityFilter}
          priceFilter={priceFilter}
        />
      )}
    </>
  );
}

export default ListWrapper;
