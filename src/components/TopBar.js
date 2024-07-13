import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useGlobalContext } from "./context/GlobalContext";
import { Icon, Spinner } from "@blueprintjs/core";

const TopBar = () => {
  const router = useRouter();
  const { isSaving, lastSaved }  = useGlobalContext();


  return (
    <nav className="top-bar flex items-center justify-between flex-wrap bg-white py-6 px-24 border-b">
      <div className="flex items-center flex-shrink-0 text-black mr-6">
        <button onClick={() => router.push('/')} className="text-3xl font-bold racking-tight h-9 w-auto">
          <Image src='../../images/logo_long.svg'
            alt="Shottoaster"
            width={200}
            height={36}
            priority={true}
             />
          </button>
      </div>
      {router.pathname === '/editor' && (
        <div className="editor-top flex gap-6 items-center">
          <div className=" text-right text-base text-gray-400 flex items-center gap-2">
            {isSaving ? <Spinner size={16} /> : <Icon icon="history" className="" />}
            <span>
              {isSaving ? '저장중...' : lastSaved === '' ? '자동 저장' : `${lastSaved} 저장됨`}
            </span>
            
            
          </div>
          <div className="text-lg rounded-lg bg-gray-100 border-2 border-gray-200 px-8 py-2 flex items-center gap-2">
            <span>기종 선택</span>
            <Icon icon="chevron-down"/>
            </div>
          <div className=" bg-black text-white px-10 py-2 text-lg rounded-full">내보내기</div>
        </div>
      )}
      
    </nav>
  );
}

export default TopBar;