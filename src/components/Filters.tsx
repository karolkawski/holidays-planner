import {IConfig} from '@/src/interfaces/IConfig';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Input,
} from '@nextui-org/react';
import {CalendarDate} from '@internationalized/date';

const Filters = ({
  config,
  handleClick,
  sourceFilter,
  date,
  handleDate,
  handleCityClick,
  handlePriceClick,
  cityFilter,
  priceFilter,
}: {
  config: IConfig;
  handleClick: (name: string) => void;
  sourceFilter: string[];
  date?: {from: CalendarDate; to: CalendarDate};
  handleDate?: (date: CalendarDate, option: 'from' | 'to') => void;
  handleCityClick?: (citys: string[]) => void;
  handlePriceClick?: (price: number, key: 'min' | 'max') => void;
  cityFilter?: string[];
  priceFilter?: {min: number; max: number};
}) => {
  const names: [string, string] = [
    config.scrapper.domains[0].name,
    config.scrapper.domains[1].name,
  ];

  return (
    <div>
      <h2>
        <b>Filters</b>
      </h2>
      <div className="flex flex-row items-start space-x-5 whitespace-nowrap mt-5 text-white">
        <h3>Source:</h3>
        {names.map((name: string, index) => (
          <Button
            color={
              sourceFilter && sourceFilter.includes(name)
                ? 'primary'
                : 'default'
            }
            key={index}
            onClick={() => handleClick(name)}
          >
            {name}
          </Button>
        ))}
      </div>
      {priceFilter && handlePriceClick ? (
        <div className="flex flex-row items-start space-x-5 whitespace-nowrap mt-5 text-white">
          <h3>Prices:</h3>
          <Input
            className="w-48"
            defaultValue={priceFilter.min}
            label="Min"
            type="number"
            onChange={(e) => {
              console.log('🚀 ~ value:', e.target.value);
              handlePriceClick(Number.parseInt(e.target.value), 'min');
            }}
          />
          <Input
            className="w-48"
            defaultValue={priceFilter.max}
            label="Max"
            type="number"
            onChange={(e) => {
              console.log('🚀 ~ value:', e.target.value);
              handlePriceClick(Number.parseInt(e.target.value), 'max');
            }}
          />
        </div>
      ) : (
        <></>
      )}
      {cityFilter && handleCityClick ? (
        <div className="flex flex-row items-start space-x-5 whitespace-nowrap mt-5 text-white">
          <h3>From:</h3>
          <CheckboxGroup
            defaultValue={cityFilter}
            orientation="horizontal"
            onValueChange={(value) => {
              console.log('🚀 ~ value:', value);
              handleCityClick(value);
            }}
          >
            <Checkbox value="Gdańsk">Gdańsk</Checkbox>
            <Checkbox value="Warszawa">Warszawa</Checkbox>
            <Checkbox value="">Unknown</Checkbox>
          </CheckboxGroup>
        </div>
      ) : (
        <></>
      )}
      {date && handleDate ? (
        <div className="w-full max-w-xl flex flex-row gap-1 mt-5 items-start">
          <h3>Date:</h3>
          <DatePicker
            label="From"
            color="primary"
            disableAnimation
            className="w-48 ml-6"
            aria-label="Date"
            value={date.from}
            onChange={(newValue: CalendarDate) => handleDate(newValue, 'from')}
          />
          <DatePicker
            label="To"
            color="primary"
            disableAnimation
            className="w-48 ml-4"
            aria-label="Date"
            value={date.to}
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
