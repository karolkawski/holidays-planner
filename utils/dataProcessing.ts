import { IOffer } from "@/types/Offer";

export async function dataProcessing(offers: IOffer[]): Promise<IOffer[]> {
  const processedOffers: IOffer[] = []; // Typowanie przetworzonych ofert

  offers.forEach((offer) => {
    const { title } = offer; // Poprawiona destrukturyzacja
    offer.from = getFrom(title); // Użycie funkcji getFrom
    processedOffers.push(offer);
  });

  // console.log("🚀 ~ dataProcessing ~ processedOffers:", processedOffers);

  return processedOffers; // Zwracanie przetworzonych ofert
}

const getFrom = (title: string): string => {

    if (!title) {
        return 'undefined'
    }
    
  const citys: Record<CityKey, { phases: string[]; name: string }> = {
    gdansk: {
      phases: ["z Gdańska"],
      name: "Gdańsk",
    },
    warszawa: {
      phases: ["z Warszawy"],
      name: "Warszawa",
    },
  };
    type CityKey = "gdansk" | "warszawa";

    const cityKeys = Object.keys(citys) as CityKey[];

    const foundCityKey = cityKeys.find((cityKey) =>
    citys[cityKey].phases.some((phase) => title.includes(phase))
    );

    return foundCityKey ? citys[foundCityKey].name : ""; 
};
