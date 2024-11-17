
import { IOffer } from "@/types/IOffer";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import Price from "./UI/Price";
import Tag from "./UI/Tag";

function Offer({ offer, index }: { offer: IOffer, index: number }) {
  if (!offer) {
    return null;
  }

  return (
    <Card key={index} className="p-5 bg-gray-600 mb-3">
      <CardHeader>
        {offer.type ? <Tag tag={offer.type} /> : <></>}
        <b>{offer.title}</b>
      </CardHeader>
      <CardBody>
        {offer.flight && (
          <p>
            <b>Flight:</b> {offer.flight}
          </p>
        )}
        <p>
          <b>From:</b> {offer.from || "---"}
        </p>
      </CardBody>
      <CardFooter className="flex justify-between">
        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 my-5 px-4 block text-center"
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "white",
            color: "#000",
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          View Offer
        </Button>
        {offer.price && <Price amount={parseInt(offer.price, 10)} />}
      </CardFooter>
    </Card>
  );
}

export default Offer;
