'use client';

import { Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react';
import ListWrapper from './ListWrapper';
import { useState } from 'react';
import Filters from './Filters';
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
import { HistoryProps } from '@/interfaces/IHistory';

function History({ names, config }: HistoryProps) {
  const [sourceFilter, setSourceFilter] = useState<string[]>(names);
  const [date, setDate] = useState<{ from: CalendarDate; to: CalendarDate }>({ from: today(getLocalTimeZone()), to: today(getLocalTimeZone()).add({ days: 1 }) });

  const handleDate = (date: CalendarDate, option: 'from' | 'to') => {
    setDate((prevFilters) => {
      if (option === 'from') {
        prevFilters.from = date;
      }
      if (option === 'to') {
        prevFilters.to = date;
      }
      return prevFilters;
    });
  };

  const handleClick = (name: string) => {
    setSourceFilter((prevFilters) => {
      if (prevFilters.includes(name)) {
        return prevFilters.filter((item) => item !== name);
      }
      return [...prevFilters, name];
    });
  };

  return (
    <main className="flex flex-col w-full">
      <div className="min-h-screen">
        <Card className="m-10 p-3 bg-gray-800">
          <Filters config={config} handleClick={handleClick} sourceFilter={sourceFilter} date={date} handleDate={handleDate} />
        </Card>
        <Card className="m-10 p-3 bg-gray-800">
          <CardHeader>Files raw data</CardHeader>
          <Divider />
          <CardBody>
            <ListWrapper config={config} sourceFilter={sourceFilter} />
          </CardBody>
          <Divider />
          <CardFooter></CardFooter>
        </Card>
      </div>
    </main>
  );
}

export default History;
