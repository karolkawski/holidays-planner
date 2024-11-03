function Datalist({ offers }) {
  return (
    <>
      <h3>Offers:</h3>
      <ul>
        {offers &&
          Object.entries(offers).map(([date, offerArray]) => (
            <li key={date} className="border p-10 m-10">
              <strong>Date:</strong> {date}
              <ul>
                {offerArray &&
                  offerArray.map((offer, index) => (
                    <li key={index} className="py-5">
                      <h4>
                        <strong>Title: </strong>
                        {offer.title}
                      </h4>
                      <p>
                        <strong>Published:</strong> {offer.added || "unknown"}
                      </p>
                      {offer.type ? (
                        <p>
                          <strong>Type:</strong> {offer.type}
                        </p>
                      ) : (
                        <></>
                      )}
                      {offer.price ? (
                        <p>
                          <strong>Price:</strong> {offer.price}
                        </p>
                      ) : (
                        <></>
                      )}
                      {offer.flight ? (
                        <p>
                          <strong>Flight:</strong> {offer.flight}
                        </p>
                      ) : (
                        <></>
                      )}
                      <p>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 my-2 px-4">
                          <a
                            href={offer.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Offer
                          </a>
                        </button>
                      </p>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
      </ul>
    </>
  );
}

export default Datalist;
