import {IPrice} from '@/src/interfaces/IPrice';
import React from 'react';

const Price = ({amount, currency = 'PLN'}: IPrice) => {
  return (
    <span className="inline-flex items-center px-3 py-1 text-md font-semibold text-green-800 bg-green-200 rounded-full justify-center">
      {amount.toFixed(2)} {currency}
    </span>
  );
};

export default Price;
