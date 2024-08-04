'use client';
import Image from "next/image";
import logo from '@/public/logo.png';
import { useState } from "react";
import { Dashboard } from "../RealShit/Dashboard";
import { getAllOrders } from "@/lib/utils";
import LoadingDots from "../LoadingDots";

export const MiddleWare = () => {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [loggedIN, setloggedIN] = useState(false);
  const [orders, setorders] = useState([]);
  const [loading, setloading] = useState(false);

  const loginUser = async (email, password, e) => {
    e.preventDefault();
    setloading(true);
    if (email == process.env.NEXT_PUBLIC_USERNAME && password == process.env.NEXT_PUBLIC_PASSWORD) {
      console.log('login success');
      setloggedIN(true);
      await refetchOrders();
    }
    setloading(false);
  };

  const refetchOrders = async () => {
    const orders = await getAllOrders();
    setorders(orders);
  };

  return (
    <div className="w-full">
      {loggedIN && loading && (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/50">
          <LoadingDots />
        </div>
      )}
      {loggedIN && orders.length == 0 && !loading && (
        <div className="flex items-center justify-center w-full h-screen">
          no active orders right now
        </div>
      )}
      {loggedIN ? (
        <Dashboard orders={orders} refetchOrders={refetchOrders} />
      ) : (
        <div className="min-h-screen w-full flex justify-center flex-col items-center gap-y-2">
          <Image
            src={logo}
            width={200}
            height={200}
            alt="logo"
            className="w-28"
          />
          <h1 className='text-3xl font-bold text-white'>Login</h1>

          <form onSubmit={(e) => loginUser(Username, Password, e)} className='mt-2'>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                id="username"
                type="text"
                placeholder="Username"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline bg-transparent"
                id="password"
                type="password"
                placeholder="***************"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};