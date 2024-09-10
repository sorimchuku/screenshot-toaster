import React, { useState } from 'react';
import Modal from 'react-modal';
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

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
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
            <button onClick={handleExport}>내보내기</button>
        </Modal>
    );
};

export default DeviceSelection;