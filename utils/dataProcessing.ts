import { IOffer } from "@/types/IOffer";

export async function dataProcessing(offers: IOffer[]): Promise<IOffer[]> {
  const processedOffers: IOffer[] = []; // Typowanie przetworzonych ofert

  offers.forEach((offer) => {
    const { title, published } = offer; // Poprawiona destrukturyzacja
    offer.from = getFrom(`${title}`); // Użycie funkcji getFrom
    offer.published = formatTime(published)
    processedOffers.push(offer);
  });

  return processedOffers; // Zwracanie przetworzonych ofert
}

const formatTime = (date: string | null) => {

    if (!date) {
        return '---'
    }

    const formatToDste = parsePublished(date);

    const day = String(formatToDste.getUTCDate()).padStart(2, "0");
    const month = String(formatToDste.getUTCMonth() + 1).padStart(2, "0");
    const year = formatToDste.getUTCFullYear();

    return `${day}-${month}-${year}`;
}

const getFrom = (title: string | null): string => {

    if (!title) {
        return 'undefined'
    }

  const citys: Record<CityKey, { phases: string[]; name: string }> = {
    gdansk: {
      phases: ["z Gdańska", "lub Gdańska"],
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


const parsePublished = (dateString: string) => {

    const monthMap: Record<
      | "stycznia"
      | "lutego"
      | "marca"
      | "kwietnia"
      | "maja"
      | "czerwca"
      | "lipca"
      | "sierpnia"
      | "września"
      | "października"
      | "listopada"
      | "grudnia",
      number
    > = {
      stycznia: 0,
      lutego: 1,
      marca: 2,
      kwietnia: 3,
      maja: 4,
      czerwca: 5,
      lipca: 6,
      sierpnia: 7,
      września: 8,
      października: 9,
      listopada: 10,
      grudnia: 11,
    };

    try {
      
      const [datePart, timePart] = dateString.split(", ");
      const [day, monthName, year] = datePart.split(" ");
      const [hour, minute] = timePart.split(":");
  
      const month = monthMap[monthName as keyof typeof monthMap];
      const dayNumber = parseInt(day, 10);
      const yearNumber = parseInt(year, 10);
      const hourNumber = parseInt(hour, 10);
      const minuteNumber = parseInt(minute, 10);
  
      return new Date(
      Date.UTC(yearNumber, month, dayNumber, hourNumber, minuteNumber)
      );
    } catch (error) {
      return new Date();
    }

};