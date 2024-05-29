import React from "react";
import { useRouter } from "next/router";

const TopBar = () => {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between flex-wrap bg-white py-6 px-36 border-b">
      <div className="flex items-center flex-shrink-0 text-black mr-6">
        <button onClick={() => router.push('/')} className="text-3xl font-bold racking-tight">shottoaster</button>
      </div>
    </nav>
  );
}

export default TopBar;