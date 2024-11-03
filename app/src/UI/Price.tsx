import React from "react";

const Price = ({ amount, currency = "PLN" }) => {
  return (
    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-green-800 bg-green-200 rounded-full">
      {amount.toFixed(2)} {currency}
    </span>
  );
};

export default Price;
