import React, { useState } from 'react';
import { devices } from "./Canvas/Data/devices";
import { Checkbox } from '@blueprintjs/core';

const DeviceSelection = ({ isOpen, onRequestClose, onSelectDevices }) => {
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [fileName, setFileName] = useState('Shottoaster');

    const firstColumnDevices = [devices[0], devices[1], devices[2]];
    const secondColumnDevices = [devices[3], devices[4]];

    const handleDeviceChange = (event) => {
        const value = event.target.value;
        setSelectedDevices((prevSelectedDevices) =>
            prevSelectedDevices.includes(value)
                ? prevSelectedDevices.filter((device) => device !== value)
                : [...prevSelectedDevices, value]
        );
    };

    const handleExport = () => {
        onSelectDevices(selectedDevices, fileName);
        onRequestClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-40">
            <div className="modal-content flex flex-col bg-white px-20 py-16 rounded-lg shadow z-50">
                <h2 className="font-bold text-2xl mb-10">이미지로 내보내기</h2>

                <div className='grid grid-cols-2 gap-y-3 gap-x-5 text-lg pb-12'>
                    <div className='col-span-2 text-xl font-bold'>기종 선택</div>
                    <div>
                        <div className='text-xl mb-4'>아이폰</div>
                        {firstColumnDevices.map((device, index) => (
                            <div key={index}>
                                <Checkbox
                                    value={String(device.id || device)}
                                    label={device.name || device}
                                    checked={selectedDevices.includes(String(device.id || device))}
                                    onChange={handleDeviceChange}
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className='text-xl mb-4'>안드로이드</div>
                        {secondColumnDevices.map((device, index) => (
                            <div key={index}>
                                <Checkbox
                                    value={String(device.id || device)}
                                    label={device.name || device}
                                    checked={selectedDevices.includes(String(device.id || device))}
                                    onChange={handleDeviceChange}
                                />
                            </div>
                        ))}
                    </div>
                    <div className='col-span-2 inline-flex gap-3 mt-2 items-center w-fit'>
                        <span className="font-bold text-xl">내보낼 파일명</span>
                        <input className='border text-lg rounded px-2' type="text" value={fileName} placeholder='Shottoaster' onChange={(e) => setFileName(e.target.value)} />
                        <span className='text-lg'>.zip</span>
                    </div>
                </div>
                
                <div className='flex gap-4 items-center justify-center'>
                    <button className='mt-2 text-lg bg-black rounded-full px-8 py-2 text-white disabled:bg-gray-300' onClick={handleExport} disabled={selectedDevices.length === 0}>내보내기</button>
                    <button className='mt-2 text-lg bg-gray-200 rounded-full px-8 py-2 text-black' onClick={onRequestClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default DeviceSelection;