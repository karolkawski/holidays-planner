'use client';

import {useEffect, useState} from 'react';
import {IOffer} from '@/src/interfaces/IOffer';
import Form from '@/src/components/Form';
import {Card, CardHeader, CardBody, CardFooter, Divider} from '@nextui-org/react';
import Response from '@/src/UI/Response';
import Offers from '@/src/components/Lists/Offers';
import {IScraperResponseItem} from '@/src/interfaces/IScraperResponseItem';
import {IConfig} from '@/src/interfaces/IConfig';
import Filters from '@/src/components/Filters';
import LogComponent from '@/src/components/Lists/Logs';

function Panel({config}: {config: IConfig}) {
  const [start, setStart] = useState(false);
  const [data, setData] = useState<IScraperResponseItem[] | null>(null);
  const [includeOffers1, setIncludeOffers1] = useState(true);
  const [includeOffers2, setIncludeOffers2] = useState(true);
  const [offers, setOffers] = useState<{[date: string]: IOffer[]} | null>(null);
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
      // Create request body
      const requestBody = {
        offers1: includeOffers1,
        offers2: includeOffers2,
      };

      try {
        const response = await fetch('/api/scrape', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Set the request content type to JSON
          },
          body: JSON.stringify(requestBody), // Convert the data to JSON format
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setData(result);
        fetchLastOffers();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setStart(false);
      }
    }

    if (start) fetchData();
  }, [start]);

  async function fetchLastOffers() {
    const today = new Date().toISOString().split('T')[0];
    const names = ['fly4free', 'pepper'];

    try {
      const response = await fetch(`/api/offer?date=${today}&name=${encodeURIComponent(JSON.stringify(names))}`);

      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }

      const result = await response.json();
      const {offers} = result;

      if (!offers) {
        return;
      }
      setOffers(offers);
      console.log('Offers received:', offers);
    } catch (error) {
      console.error('Error in fetching last offers:', error);
    }
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
    <div className="h-screen w-full flex justify-center items-start">
      <Card className="bg-gray-800 mx-4 flex-1 min-w-96 min-h-48">
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
          <Response start={start} data={data} />
        </CardBody>
        <Divider />
        <CardFooter className="flex-none w-full">
          {offers ? (
            <div className="flex flex-col">
              <Filters config={config} handleClick={handleClick} sourceFilter={sourceFilter} />
              <Offers offers={offers} sourceFilter={sourceFilter} />
            </div>
          ) : (
            <></>
          )}
        </CardFooter>
      </Card>
      <Card className="bg-gray-800 mx-4 flex-1 min-w-96 min-h-48 overflow-y-auto">
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
