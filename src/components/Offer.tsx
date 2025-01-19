import {IOffer} from '@/src/interfaces/IOffer';
import {Card, CardBody, CardFooter, CardHeader, Chip, Link} from '@nextui-org/react';
import Price from '@/src/UI/Price';
import Tag from '@/src/UI/Tag';

function Offer({offer, index}: {offer: IOffer; index: number}) {
  if (!offer) {
    return null;
  }

  return (
    <Card key={index} className="p-5 mb-3 bg-primary">
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
          <b>From:</b> {offer.from || '---'}
        </p>
      </CardBody>
      <CardFooter className="flex justify-between">
        <Link
          color="primary"
          className=" text-white font-bold py-1 my-5 px-4 block text-center"
          href={offer.url || undefined}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: 'white',
            color: '#000',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          View Offer
        </Link>
        {offer.price && <Price amount={parseInt(offer.price, 10)} />}

        <Chip color="warning">{offer.source || 'unknown'}</Chip>
      </CardFooter>
    </Card>
  );
}

export default Offer;
