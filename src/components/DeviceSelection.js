import React, { useState } from 'react';
import { devices } from "./Canvas/Data/devices";

const DeviceSelection = ({ isOpen, onRequestClose, onSelectDevices }) => {
    const [selectedDevices, setSelectedDevices] = useState([]);

    const handleDeviceChange = (event) => {
        const value = event.target.value;
        setSelectedDevices((prevSelectedDevices) =>
            prevSelectedDevices.includes(value)
                ? prevSelectedDevices.filter((device) => device !== value)
                : [...prevSelectedDevices, value]
        );
    };

    const handleExport = () => {
        onSelectDevices(selectedDevices);
        onRequestClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
            <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-40">
                <div className="modal-content bg-white p-5 rounded-lg shadow z-50">
                    <h2>기종 선택</h2>
                    <div>
                        {devices.map((device) => (
                            <div key={device.id}>
                                <input
                                    type="checkbox"
                                    value={String(device.id)}
                                    checked={selectedDevices.includes(String(device.id))}
                                    onChange={handleDeviceChange}
                                />
                                <label>{device.name}</label>
                            </div>
                        ))}
                    </div>
                    <button className='mt-2' onClick={handleExport} disabled={selectedDevices.length === 0}>내보내기</button>
                    <button className='mt-2' onClick={onRequestClose}>닫기</button>
                </div>
            </div>
    );
};

export default DeviceSelection;