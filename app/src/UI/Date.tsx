import React from "react";

const Date = ({ date }: { date: string }) => {
  return (
    <div className="py-3 shadow-md rounded">
      <p className="text-lg font-semibold text-white">
        Data: <span id="formattedDate"> {date}</span>
      </p>
    </div>
  );
};

export default Date;
