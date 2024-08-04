import { MiddleWare } from "@/components/middleWare/MiddleWare";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-12">
      <a href="/search" className="text-blue-500 text-sm hover:text-blue-400 self-end py-4">Search</a>

     <MiddleWare/>
    </main>
  );
}
