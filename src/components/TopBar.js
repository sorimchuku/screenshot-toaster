import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useGlobalContext } from "./context/GlobalContext";
import { Icon, Spinner } from "@blueprintjs/core";
import { devices } from "./Canvas/Data/devices";
import DeviceSelection from "./DeviceSelection";

const TopBar = () => {
  const router = useRouter();
  const { isSaving, lastSaved, selectedDevice, setSelectedDevice, triggerSaveEvent, triggerExportEvent, saveMethod, setSaveMethod, undo, redo, history, currentStep } = useGlobalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disabled, setDisabled] = useState({
    undo: true,
    redo: true,
  })

  useEffect(() => {
    if(currentStep > 0) {
      setDisabled((prev) => ({...prev, undo: false}) )
    } else {
      setDisabled((prev) => ({...prev, undo: true}))
    }

    if (currentStep < history.length - 1) {
      setDisabled((prev) => ({...prev, redo: false}))
    } else {
      setDisabled((prev) => ({...prev, redo: true}))
    }
  }, [history, currentStep]);

  const handleDeviceChange = (e) => {
    const newDevice = devices.find(device => device.id === parseInt(e.target.value));
    setSelectedDevice(newDevice);
  };

  const handleSave = async () => {
    setSaveMethod('manual');
    triggerSaveEvent();
  };

  const handleExport = () => {
    setIsModalOpen(true);
  };

  const handleSelectDevices = (exportDevices, fileName) => {
    triggerExportEvent(exportDevices, fileName);
  };

  return (
    <nav className="top-bar flex items-center justify-between flex-wrap bg-white py-6 px-24 border-b">
      <div className="flex items-center gap-4 flex-shrink-0 text-black mr-6">
        <button onClick={() => router.push('/')} className="text-3xl font-bold racking-tight h-9 w-auto">
          <Image src='/images/logo_long.svg'
            alt="Shottoaster"
            width={200}
            height={36}
          />
        </button>
        <div onClick={() => router.push('/guide')} className="font-bold text-gray-400 hover:underline cursor-pointer">앱스토어 스크린샷이 처음이라면?</div>
          
      </div>
      {router.pathname === '/editor' && (
        <div className="editor-top flex gap-6 items-center">
          <div className="gap-4 flex items-center">
            <button onClick={undo}>
              <Icon icon="undo" size={20} className={disabled.undo ? 'text-gray-400' : 'text-gray-700'} /> {/* 비활성화: 400 */}
            </button>
            <button onClick={redo}>
              <Icon icon="redo" size={20} className={disabled.redo ? 'text-gray-400' : 'text-gray-700'} />
            </button>
          </div>
          <div className=" text-right text-base text-gray-400 flex items-center gap-2 cursor-pointer" onClick={handleSave}>
            {isSaving ? <Spinner size={16} /> : <Icon icon="history" className="" />}
            <span>
              {isSaving ? '저장중...' : lastSaved === '' ? '자동 저장' : saveMethod === 'auto' ? `${lastSaved} 자동 저장됨` : `${lastSaved} 저장됨`}
            </span>


          </div>
          <div className="text-lg rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center gap-2 focus:outline-none">
            <select onChange={handleDeviceChange} className="bg-transparent focus:outline-none mx-4 my-2" value={selectedDevice ? selectedDevice.id : ''}>
              <option value="" className="">미리보기 기종 선택</option>
              {devices.map(device => (
                <option key={device.id} value={device.id} className="device-select text-lg">{device.name}</option>
              ))}
            </select>
              
          </div>
          <div className=" bg-black text-white px-10 py-2 text-lg rounded-full cursor-pointer" onClick={handleExport}>내보내기</div>
        </div>
      )}
      <DeviceSelection isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} onSelectDevices={handleSelectDevices} />

    </nav>
  );
}

export default TopBar;