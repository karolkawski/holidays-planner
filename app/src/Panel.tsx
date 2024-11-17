"use client";

import { useEffect, useState } from "react";
import { IOffer } from "@/types/IOffer";
import Form from "./Form";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import DataInfo from "./ResponseInfo";
import Datalist from "./OffersList";
import { IScraperResponseItem } from "@/types/IScraperResponseItem";
import { IConfig } from "@/types/IConfig";

function Panel({
  config
}: {
  config: IConfig
}) {
  const [start, setStart] = useState(false);
  const [data, setData] = useState<
    IScraperResponseItem[] | null
  >(null);
  const [includeOffers1, setIncludeOffers1] = useState(true);
  const [includeOffers2, setIncludeOffers2] = useState(true);
  const [files, setFiles] = useState<{
    offers: string[] | null;
    screenshots: string[] | null;
  } | null>(null);
  const [offers, setOffers] = useState<IOffer[] | null>(null);

  const handleRunScape = () => {
    setStart(true);
    setData(null)
    setFiles(null)
    setOffers(null)
  };

  const handleCheckboxChange1 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIncludeOffers1(event.target.checked);
  };
  const handleCheckboxChange2 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIncludeOffers2(event.target.checked);
  };

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
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(`/api/offers?date=${today}`);
    const result = await response.json();
    const { files, offers } = result;
    setFiles(files);
    setOffers(offers);
  }

  return (
    <Card className="bg-gray-800">
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
        <DataInfo data={data} />
      </CardBody>
      <Divider />
      <CardFooter className="flex-none w-full">
        {offers && <Datalist offers={offers} />}
      </CardFooter>
    </Card>
  );
}

export default Panel;
