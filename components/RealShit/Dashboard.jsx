'use client'
import React, { useEffect, useState } from 'react';
import mobile from '@/public/assets/mobile.svg';
import visa from '@/public/assets/visa.svg';
import Image from "next/image";
import { getProductDetails } from '@/lib/utils';
import LoadingDots from '../LoadingDots';

export const Dashboard = ({ orders, loading }) => {
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchProductDetails = async (orders) => {
      // Flatten all items from each order into a single array of promises
      const promises = orders.flatMap(order => order.items.map(item => getProductDetails(item.id)));

      try {
        // Resolve all promises concurrently
        const results = await Promise.all(promises);

        // Map results to the corresponding product IDs
        const details = results.reduce((acc, productDetail, index) => {
          // Find the order and item for the current index
          let currentIndex = index;
          for (const order of orders) {
            if (currentIndex < order.items.length) {
              acc[order.items[currentIndex].id] = productDetail;
              break;
            }
            currentIndex -= order.items.length;
          }
          return acc;
        }, {});

        setProductDetails(details);
      } catch (error) {
        console.error('Error fetching product details:', error);
        // Handle error accordingly
      }
    };

    if (orders) {
      fetchProductDetails(orders);
    }
  }, [orders]);

  if(loading){
<div className="flex items-center justify-center w-full h-screen">
<LoadingDots/>

</div>
  }
  return (
    <div className=' flex flex-col gap-4'>
      {orders.map((order) => {
          const orderId = Object.keys(order)[0];
          const orderData = order[orderId];

        return (  <div key={order.id} className={`flex flex-col md:flex-row gap-6 border border-white/20 p-4 rounded-lg`}>
        <div className="rounded-lg shadow-md flex-grow">
          <h2 className="text-xl font-semibold mb-1">Order Doc ID {order.id}</h2>
          <p className="mb-6">Placed on {formatCreatedAt(order.createdAt)}</p>
          
          <h3 className="text-lg font-semibold mb-2">Delivery Details</h3>
          <p className="text-green-600 mb-4">{order.status} · Confirmed</p>
          
          {order.items?.map((item, index) => (
            <a key={index} className="bg-white/10 hover:bg-white/20 flex items-center p-4 mb-2 rounded-lg justify-between" target='_blank' href={`https://e-commerce-myass.vercel.app/frame/${item.id}?type=${item.type}&size=${item.size}&color=${item.color}`}>
              <div className="flex flex-row gap-2 items-center">
                <span className="leading-tight relative">
                  {productDetails[item.id]?.images[0] ? (
                    <Image
                      className="rounded-lg"
                      src={productDetails[item.id]?.images[0]}
                      alt={productDetails[item.id]?.id}
                      width={100}
                      height={150}
                    />
                  ) : (
                    <div className="h-20 flex flex-col items-center justify-center">loading...</div>
                  )}
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-medium text-white">
                    <div className="">x{item.quantity}</div>
                  </div>
                </span>

                <div className="text-xs">
                  <p className="font-medium text-base">{productDetails[item.id]?.name}</p>
                  <p>{item.type}</p>
                  <p>{item.color} - {item.size}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <div className="rounded-lg shadow-md w-full md:w-80">
          <h3 className="text-lg font-semibold mb-4">Order invoice</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between font-bold">
              <span>Order total</span>
              <span>EGP {calculateTotalPrice(order.items).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center gap-2">
              {orderData.source_data?.type === 'wallet' ? (
                <Image src={mobile} alt="card logo" className="w-6 h-6" width={40} height={40} />
              ) : (
                <Image src={visa} alt="card logo" className="w-6 h-6" width={40} height={40} />
              )}
              <span>Ending in {orderData.source_data?.phone_number?.slice(-4)}</span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Delivery address (Home)</h3>
          <p className="mb-1 text-sm ">{orderData.shipping_data?.first_name} {orderData.shipping_data?.email}</p>
          <p className="mb-1">{orderData.shipping_data?.street}, {orderData.shipping_data?.city}, {orderData.shipping_data?.country}</p>
          <p className="flex items-center">
            {orderData.shipping_data?.phone_number}
            <span className="ml-2 text-green-600 text-sm">Verified</span>
          </p>
        </div>
      </div>)
      })}
    </div>
  );
};

function formatCreatedAt(timestamp) {
  if (!timestamp || !timestamp.seconds) return 'N/A';
  
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

const calculateTotalPrice = (items) => {
  if (!items || !Array.isArray(items)) {
    return 0;
  }
  return items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
};
