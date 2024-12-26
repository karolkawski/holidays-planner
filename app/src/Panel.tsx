'use client';

import { useEffect, useState } from 'react';
import { IOffer } from '@/interfaces/IOffer';
import Form from './Form';
import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react';
import DataInfo from './ResponseInfo';
import Datalist from './OffersList';
import { IScraperResponseItem } from '@/interfaces/IScraperResponseItem';
import { IConfig } from '@/interfaces/IConfig';
import Filters from './Filters';
import LogComponent from './LogComponent';

function Panel({ config }: { config: IConfig }) {
  const [start, setStart] = useState(false);
  const [data, setData] = useState<IScraperResponseItem[] | null>(null);
  const [includeOffers1, setIncludeOffers1] = useState(true);
  const [includeOffers2, setIncludeOffers2] = useState(true);
  const [offers, setOffers] = useState<{ [date: string]: IOffer[] } | null>(null);
  const names = [config.scrapper.domains[0].name, config.scrapper.domains[1].name];
  const [sourceFilter, setSourceFilter] = useState<string[]>(names);

  const handleRunScape = () => {
    setStart(true);
    setData(null);
    setOffers(null);
  };

  const handleCheckboxChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeOffers1(event.target.checked);
  };
  const handleCheckboxChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeOffers2(event.target.checked);
  };

  useEffect(() => {
    fetchLastOffers();
  }, []);

  useEffect(() => {
    async function fetchData() {
      let url = `/api/scrape?`;
      if (includeOffers1) url += `offers1=${includeOffers1}&`;
      if (includeOffers2) url += `offers2=${includeOffers2}`;
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
      fetchLastOffers();
      setStart(false);
    }
    if (start) fetchData();
  }, [start]);

  async function fetchLastOffers() {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`/api/offers?date=${today}&name=${encodeURIComponent(JSON.stringify(names))}`);
    const result = await response.json();
    const { offers } = result;
    setOffers(offers);
  }

  const handleClick = (name: string) => {
    setSourceFilter((prevFilters) => {
      if (prevFilters.includes(name)) {
        return prevFilters.filter((item) => item !== name);
      }
      return [...prevFilters, name];
    });
  };
  return (
    <div className="flex items-start">
      <Card className="bg-gray-800 m-5 flex-1 min-w-96 min-h-48">
        <CardHeader>Settings</CardHeader>
        <Divider />
        <CardBody>
          <Form
            includeOffers1={includeOffers1}
            handleCheckboxChange1={handleCheckboxChange1}
            includeOffers2={includeOffers2}
            handleCheckboxChange2={handleCheckboxChange2}
            handleRunScape={handleRunScape}
            config={config}
          />
          <DataInfo start={start} data={data} />
        </CardBody>
        <Divider />
        <CardFooter className="flex-none w-full">
          {offers ? (
            <div className="flex flex-col">
              <Filters config={config} handleClick={handleClick} sourceFilter={sourceFilter} />
              <Datalist offers={offers} sourceFilter={sourceFilter} />
            </div>
          ) : (
            <></>
          )}
        </CardFooter>
      </Card>
      <Card className="bg-gray-800 m-5 flex-1 min-w-96 min-h-48 max-h-svh overflow-y-auto">
        <CardHeader>Logs</CardHeader>
        <Divider />
        <CardBody>
          <LogComponent />
        </CardBody>
        <Divider />
        <CardFooter className="flex-none w-full"></CardFooter>
      </Card>
    </div>
  );
}

export default Panel;
