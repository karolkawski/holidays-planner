'use client';

import {useState} from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  CalendarDate,
} from '@nextui-org/react';
import {IConfig} from '@/src/interfaces/IConfig';
import ListWrapper from '@/src/components/ListWrapper';
import Filters from '@/src/components/Filters';
import {getLocalTimeZone, today, parseDate} from '@internationalized/date';

function History({config}: {config: IConfig}) {
  const configScrapper = config.scrapper;
  const [domain1, domain2] = configScrapper.domains;
  const names = [domain1.name, domain2.name];
  const [sourceFilter, setSourceFilter] = useState<string[]>(names);
  const [cityFilter, setCityFilter] = useState<string[]>([
    'Gdańsk',
    'Warszawa',
    '',
  ]);
  const [priceFilter, setPriceFilter] = useState<{min: number; max: number}>({
    min: 0,
    max: 10000,
  });
  const [date, setDate] = useState<{from: CalendarDate; to: CalendarDate}>({
    from: parseDate('2023-01-01'),
    to: today(getLocalTimeZone()),
  });

  const handleDate = (date: CalendarDate, option: 'from' | 'to') => {
    setDate((prevFilters) => ({
      ...prevFilters,
      [option]: date,
    }));
  };

  const handleClick = (name: string) => {
    setSourceFilter((prevFilters) => {
      if (prevFilters.includes(name)) {
        return prevFilters.filter((item) => item !== name);
      }
      return [...prevFilters, name];
    });
  };

  const handleCityClick = (citys: string[]) => {
    setCityFilter([...citys]);
  };
  const handlePriceClick = (price: number, key: 'min' | 'max') => {
    setPriceFilter((prevFilters) => ({
      ...prevFilters,
      [key]: price,
    }));
  };

  return (
    <div className="min-h-screen">
      <Card className="m-10 p-3 bg-gray-800">
        <Filters
          config={config}
          handleClick={handleClick}
          handleCityClick={handleCityClick}
          handlePriceClick={handlePriceClick}
          cityFilter={cityFilter}
          priceFilter={priceFilter}
          sourceFilter={sourceFilter}
          date={date}
          handleDate={handleDate}
        />
      </Card>
      <Card className="m-10 p-3 bg-gray-800">
        <CardHeader>Data</CardHeader>
        <Divider />
        <CardBody>
          <ListWrapper
            config={config}
            sourceFilter={sourceFilter}
            cityFilter={cityFilter}
            priceFilter={priceFilter}
            date={date}
          />
        </CardBody>
        <Divider />
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}

export default History;
