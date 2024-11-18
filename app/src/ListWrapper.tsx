"use client";

import { useEffect, useState } from "react";
import { IOffer } from "@/types/IOffer";
import FilesList from "./FilesList";
import Datalist from "./OffersList";
import { IConfig } from "@/types/IConfig";

function ListWrapper({config}: {config: IConfig}) {
  const [files, setFiles] = useState<{
    offers: string[] | null;
    screenshots: string[] | null;
  } | null>(null);
  const [offers, setOffers] = useState<IOffer[] | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  async function fetchOffers() {
    console.log(config.scrapper.domains[0])
     const names = [
       config.scrapper.domains[0].name,
       config.scrapper.domains[1].name,
     ];
    const response = await fetch(
      `/api/offers?name=${encodeURIComponent(JSON.stringify(names))}`
    );
    const result = await response.json();
    const { files, offers } = result;
    setFiles(files);
    setOffers(offers);
  }

  if (!files && !offers) {
    return <></>;
  }

  return (
    <>
      {offers && <Datalist offers={offers} />}
      {files && <FilesList files={files} />}
    </>
  );
}

export default ListWrapper;
