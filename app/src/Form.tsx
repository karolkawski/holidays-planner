"use client";
import { useEffect, useState } from "react";
import ScraperComponent from "./ScraperComponent";
import { IScraperData } from "@/types/ScraperData";

function Form() {
  const [start, setStart] = useState(false);
  const [data, setData] = useState<IScraperData | null>(null);

  const handleRunScape = () => {
    setStart(true);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/scrape");
      const result = await response.json();
      setData(result)
    }
    console.log("fetch data");
    if (start) fetchData();
  }, [start]);

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
        onClick={handleRunScape}
      >
        Run scraping
      </button>
      {start ? <ScraperComponent data={data} /> : <></>}
    </>
  );
}

export default Form;
