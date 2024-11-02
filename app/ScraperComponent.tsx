"use client";

function ScraperComponent({
  data,
}: {
  data: { title: string; content: string } | null;
}) {
  return (
    <div>
      {data ? (
        <>
          <h1>{data.title}</h1>
          <p>{data.content}</p>
        </>
      ) : (
        <button type="button" className="bg-indigo-500 ..." disabled>
          <svg
            className="animate-spin h-5 w-5 mr-3 ..."
            viewBox="0 0 24 24"
          ></svg>
          Processing...
        </button>
      )}
    </div>
  );
}

export default ScraperComponent;
