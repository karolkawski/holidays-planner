"use client";

function ScraperComponent({
  data,
}: {
  data: {
    title: string;
    status: string;
    date: string;
    offersLength: number;
  } | null;
}) {
  return (
    <>
      {data ? (
        <div className="flex justify-center flex-col items-start mt-4 bg-gray-900 p-5 rounded">
          <h1>
            <b>{data.title}</b>
          </h1>
          <p>{data.status}</p>
          <p>
            <b>Date:</b> {data.date}
          </p>
          <p><b>Offers:</b> {data.offersLength}</p>
        </div>
      ) : (
        <div className="flex justify-center flex-col items-center mt-4">
          <div
            className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default ScraperComponent;
