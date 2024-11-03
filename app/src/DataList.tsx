import Price from "./UI/Price";
import Date from "./UI/Date";
import Tag from "./UI/Tag";

function Datalist({ offers }) {
  return (
    <>
      <h3>Offers:</h3>
      <ul>
        {offers &&
          Object.entries(offers).map(([date, offerArray]) => (
            <>
              <Date date={date} />
              <li key={date} className="border p-10 m-10">
                <ul>
                  {offerArray &&
                    offerArray.map((offer, index) => (
                      <li key={index} className="py-5">
                        <h4>
                          <strong>{offer.title}</strong>
                        </h4>
                        <div className="flex justify-between">
                          {offer.type ? <Tag tag={offer.type} /> : <></>}
                          {offer.price ? (
                            <Price amount={Number.parseInt(offer.price)} />
                          ) : (
                            <></>
                          )}
                        </div>
                        {offer.flight ? (
                          <p>
                            <strong>Flight:</strong> {offer.flight}
                          </p>
                        ) : (
                          <></>
                        )}
                          <p>
                            <strong>From:</strong> {offer.from || '---'}
                          </p>
                   
                        <a
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 my-5 px-4"
                          href={offer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Offer
                        </a>
                      </li>
                    ))}
                </ul>
              </li>
            </>
          ))}
      </ul>
    </>
  );
}

export default Datalist;
