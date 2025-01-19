import { IConfig } from '@/src/interfaces/IConfig';
import { Button, Checkbox } from '@nextui-org/react';
import { ChangeEventHandler, MouseEventHandler } from 'react';

function Form({
  includeOffers1,
  handleCheckboxChange1,
  includeOffers2,
  handleCheckboxChange2,
  handleRunScape,
  config,
}: {
  includeOffers1: boolean;
  handleCheckboxChange1: ChangeEventHandler<HTMLInputElement>;
  includeOffers2: boolean;
  handleCheckboxChange2: ChangeEventHandler<HTMLInputElement>;
  handleRunScape: MouseEventHandler<HTMLButtonElement>;
  config: IConfig;
}) {
  const scrapperCofigs = config.scrapper.domains;

  const webConfigNo0 = scrapperCofigs[0];
  const webConfigNo1 = scrapperCofigs[1];

  return (
    <>
      <div className="py-3">
        <div className="flex flex-col">
          <Checkbox className="" type="checkbox" value="" disabled={false} id="checkboxChecked1" isSelected={includeOffers1} onChange={handleCheckboxChange1}>
            Offers [ <b>{webConfigNo0.name}</b> ]
          </Checkbox>
          <Checkbox className="" type="checkbox" value="" disabled={false} id="checkboxChecked2" isSelected={includeOffers2} onChange={handleCheckboxChange2}>
            Offers [ <b>{webConfigNo1.name}</b> ]
          </Checkbox>
        </div>
      </div>
      <Button color="primary" className="py-2 px-4" onClick={handleRunScape}>
        Run scraping
      </Button>
    </>
  );
}

export default Form;
