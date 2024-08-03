'use client'
import React, { useState } from 'react';
import { checkIfOrderExists } from '@/lib/utils'; 
import { Dashboard } from './Dashboard';
export const Search = () => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState([]);

  const handleSearch = async () => {
    const result = await checkIfOrderExists(orderId);
    console.log('result', result);
    setOrderData(result);
  };

  return (
    <div className="flex flex-col gap-4">
      <a href="/" className="text-blue-500 text-sm hover:text-blue-400">← Back to Dashboard</a>
      <p className="text-xl font-bold self-center">Search for an order</p>
      <div className='grid grid-cols-5 w-full gap-4'>
      <input
        type="text"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="w-full rounded-lg p-2 border border-white/20 text-black col-span-4 text-black font-bold"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
      </div>
      {orderData ? (
        <Dashboard orders={orderData} loading={false} />
      ) : (
        orderData === false && <div>Order not found</div>
      )}
    </div>
  );
};
