import { IScraperResponseItem } from "@/types/IScraperResponseItem";
import { Spinner } from "@nextui-org/react";

function ResponseInfo({
  data,
  start
}: {
  data:
    IScraperResponseItem[]
    | null;
    start: boolean
}) {
  if (start) {
    return (
      <div className="flex flex-col justify-center items-center mt-10">
        <Spinner />
      </div>
    );
  }
  if (!data) {
    return null
  }
  return (
    <div className="flex flex-col justify-center items-center">
      {data.map((scrapeInfo, index) => {
        return (
          <div
            key={index}
            className="flex w-full justify-center flex-col items-start mt-4 bg-gray-900 p-5 rounded"
          >
            <h1>
              <b>{scrapeInfo.title}</b>
            </h1>
            <p>{scrapeInfo.status}</p>
            <p>
              <b>Date:</b> {scrapeInfo.date.toString()}
            </p>
            <p>
              <b>Offers:</b> {scrapeInfo.offersLength}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default ResponseInfo;
