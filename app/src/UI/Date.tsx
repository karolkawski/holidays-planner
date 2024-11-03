import React from "react";

const Date = ({ date }) => {
  return (
    <div className="bg-white p-4 m-4 shadow-md rounded">
    <p className="text-lg font-semibold text-gray-800">Data: <span id="formattedDate">  {date}</span></p>
</div>
  );
};

export default Date;
