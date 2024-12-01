import { IConfig } from '@/interfaces/IConfig';
import { Button, DatePicker } from '@nextui-org/react';
import { CalendarDate, parseDate } from '@internationalized/date';

const Filters = ({
  config,
  handleClick,
  sourceFilter,
  date,
  handleDate,
}: {
  config: IConfig;
  handleClick: (name: string) => void;
  sourceFilter: string[];
  date?: { from: CalendarDate; to: CalendarDate };
  handleDate?: (date: CalendarDate, option: 'from' | 'to') => void;
}) => {
  const names: [string, string] = [config.scrapper.domains[0].name, config.scrapper.domains[1].name];

  return (
    <div>
      <h2>
        <b>Filters</b>
      </h2>
      <div className="flex flex-row items-center space-x-5 whitespace-nowrap mt-5">
        <h3>Source:</h3>
        {names.map((name: string, index) => (
          <Button color={sourceFilter && sourceFilter.includes(name) ? 'primary' : 'default'} key={index} onClick={() => handleClick(name)}>
            {name}
          </Button>
        ))}
      </div>
      {date && handleDate ? (
        <div className="w-full max-w-xl flex flex-row gap-1 mt-5 items-center">
          <h3>Date:</h3>
          <DatePicker
            label="From"
            color="primary"
            disableAnimation
            className="w-36 ml-8"
            aria-label="Date"
            value={parseDate(date.from.toString())}
            onChange={(newValue: CalendarDate) => handleDate(newValue, 'from')}
          />
          <DatePicker
            label="To"
            color="primary"
            disableAnimation
            className="w-36"
            aria-label="Date"
            value={parseDate(date.to.add({ days: 1 }).toString())}
            onChange={(newValue: CalendarDate) => handleDate(newValue, 'to')}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Filters;
