import Date from "./UI/Date";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { IOffer } from "@/types/IOffer";
import Offer from "./Offer";

function OffersList({ offers }: { offers: IOffer[] }) {
  if (!offers) {
    return null;
  }

  return (
      <Accordion>
        {Object.entries(offers).map(([date, offerArray]) => (
          <AccordionItem
            key={date}
            title={<Date date={date} />}
            aria-label={`Offers for ${date}`}
          >
            {offerArray &&
              Array.isArray(offerArray) &&
              offerArray.map((offer, index) => (
                <Offer offer={offer} index={index}/>
              ))}
          </AccordionItem>
        ))}
      </Accordion>
  );
}

export default OffersList;
