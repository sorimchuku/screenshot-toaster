import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const TopBar = () => {
  const router = useRouter();

  return (
    <nav className="top-bar flex items-center justify-between flex-wrap bg-white py-6 px-36 border-b">
      <div className="flex items-center flex-shrink-0 text-black mr-6">
        <button onClick={() => router.push('/')} className="text-3xl font-bold racking-tight h-9 w-auto">
          <Image src='../../images/logo_long.svg'
            alt="Shottoaster"
            width={200} height={36} />
          </button>
      </div>
    </nav>
  );
}

export default TopBar;