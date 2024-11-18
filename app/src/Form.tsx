import { IConfig } from "@/types/IConfig";
import { Button } from "@nextui-org/react";
import { ChangeEventHandler, MouseEventHandler } from "react";

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
        <div className="flex">
          <div className="mb-[0.125rem] block min-h-[1.5rem] ps-[1.5rem] mr-10">
            <input
              className="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent rtl:float-right dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-primary"
              type="checkbox"
              value=""
              disabled={false}
              id="checkboxChecked1"
              checked={includeOffers1}
              onChange={handleCheckboxChange1}
            />
            <label
              className="inline-block ps-[0.15rem] hover:cursor-pointer"
              htmlFor="checkboxChecked1"
            >
              Offers [ <b>{webConfigNo0.name}</b> ]
            </label>
          </div>
          <div className="mb-[0.125rem] block min-h-[1.5rem] ps-[1.5rem]">
            <input
              className="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent rtl:float-right dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-primary"
              type="checkbox"
              value=""
              disabled={false}
              id="checkboxChecked2"
              checked={includeOffers2}
              onChange={handleCheckboxChange2}
            />
            <label
              className="inline-block ps-[0.15rem] hover:cursor-pointer"
              htmlFor="checkboxChecked2"
            >
              Offers [ <b>{webConfigNo1.name}</b> ]
            </label>
          </div>
        </div>
      </div>
      <Button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
        onClick={handleRunScape}
      >
        Run scraping
      </Button>
    </>
  );
}

export default Form;
