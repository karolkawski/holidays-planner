"use client";
import { useEffect, useState } from "react";
import ScraperComponent from "./ScraperComponent";
import { IScraperData } from "@/types/ScraperData";
import { IOffer } from "@/types/Offer";
import Form from "./Form";
import FilesList from "./FilesList";
import Datalist from "./DataList";

function Panel() {
  const [start, setStart] = useState(false);
  const [data, setData] = useState<IScraperData | null>(null);
  const [includeOffers, setIncludeOffers] = useState(true);
  const [files, setFiles] = useState<{
    offers: string[] | null;
    screenshots: string[] | null;
  } | null>(null);
  const [offers, setOffers] = useState<IOffer[] | null>(null);

  const handleRunScape = () => {
    setStart(true);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeOffers(event.target.checked);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/scrape");
      const result = await response.json();
      setData(result);
    }
    console.log("fetch data");
    if (start) fetchData();
  }, [start]);

  useEffect(() => {
    fetchOffers();
  }, [data]);

  async function fetchOffers() {
    const response = await fetch("/api/offers");
    const result = await response.json();
    const { files, offers } = result;
    setFiles(files);
    setOffers(offers);
  }

  return (
    <>
      <Form
        includeOffers={includeOffers}
        handleCheckboxChange={handleCheckboxChange}
        handleRunScape={handleRunScape}
      />
      {start ? <ScraperComponent data={data} /> : <></>}
      <div className="mt-10">
        <FilesList files={files} />
        <Datalist offers={offers} />
      </div>
    </>
  );
}

export default Panel;
