import {IOffer} from '@/src/interfaces/IOffer';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Link,
} from '@nextui-org/react';
import Price from '@/src/UI/Price';
import Tag from '@/src/UI/Tag';

function Offer({offer, index}: {offer: IOffer; index: number}) {
  if (!offer) {
    return null;
  }

  return (
    <Card key={index} className="p-5 mb-3 bg-primary">
      <CardHeader className="items-start">
        <Chip size="lg" color="warning">
          {offer.source || 'unknown'}
        </Chip>
        <b className="pl-5">{offer.title}</b>
      </CardHeader>
      <CardBody>
        <div className="flex justify-between">
          <div>
            <p>
              <b>Type: </b> {offer.type ? <Tag tag={offer.type} /> : <></>}
            </p>
            <p>
              <b>From:</b> {offer.from || '---'}
            </p>
            <p>
              <b>Flight price:</b> {offer.flight || '---'}
            </p>
          </div>
          <Price amount={parseInt(offer.price || '0', 10)} />
        </div>
      </CardBody>
      <CardFooter className="">
        <Link
          color="primary"
          className=" text-white font-bold py-1 my-5 px-3 block text-center"
          href={offer.url || undefined}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: 'transparent',
            color: '#fff',
            border: '1px solid #fff',
            padding: '5px 10px',
            borderRadius: '5px',
          }}
        >
          View Offer
        </Link>
      </CardFooter>
    </Card>
  );
}

export default Offer;
