'use client';
import Image from "next/image";
import logo from '@/public/logo.png'
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
  setloading(true)
    if (email ==process.env.NEXT_PUBLIC_USERNAME && password == process.env.NEXT_PUBLIC_PASSWORD) {
        console.log('login success')
        setloggedIN(true)
        const orders=await getAllOrders();
        console.log('orders', orders)
        setorders(orders)
    }
  setloading(false)

}
  return (
   
   <div className="w-full">
    {loggedIN && loading &&   (
     <div className="flex items-center justify-center w-full h-screen">
     <LoadingDots/>
     
     </div>
    )}
    {loggedIN ? <Dashboard orders={orders&&orders} loading={loading}/> : 
    
    
    
     <div className=" min-h-screen w-full flex justify-center flex-col items-center  gap-y-2">
    <Image
    src={logo}
    width={200}
    height={200}
    alt="logo"
    className="w-28"
    />
      <h1 className='text-3xl font-bold text-white'>Login</h1>
      
      <form onSubmit={(e) => loginUser(Username, Password, e)} className=" max-w-[500px] flex flex-col gap-y-4 w-full">
       
      <div className="w-full flex flex-col gap-y-2">
        <label htmlFor="username" className="text-xl font-medium text-white">
          E-mail
        </label>
        <input
          id="username"
          name="username"
          type="email"
          required
          placeholder="Enter your E-mail"
          onChange={(e) => setUsername(e.target.value)}
          className="rounded-lg h-10 font-bold text-black text-md p-2"
        />
      </div>

      <div className="w-full flex flex-col gap-y-2">
        <label htmlFor="password" className="text-xl font-medium text-white">
          Password
        </label>
        <div className="flex flex-col gap-y-4">
          <input
            id="password"
            name="password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="rounded-lg h-10 font-bold text-black text-md p-2"
          />
          
        </div>
      </div>
      
        <button role='submit' className=' text-lg font-bold rounded-lg p-2  bg-blue-500 hover:bg-blue-600 duration-900'
          
          >
          Login
          </button>
    </form>
      
    </div>
}
   </div>
  );
};
