"use client";

import { useEffect, useState } from "react";
import { IOffer } from "@/types/IOffer";
import FilesList from "./FilesList";
import Datalist from "./OffersList";

function ListWrapper() {
  const [files, setFiles] = useState<{
    offers: string[] | null;
    screenshots: string[] | null;
  } | null>(null);
  const [offers, setOffers] = useState<IOffer[] | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  async function fetchOffers() {
    const response = await fetch("/api/offers");
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
