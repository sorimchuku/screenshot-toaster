// context/GlobalContext.js
import React, { createContext, useContext, useState, useRef } from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const TemplateProvider = ({ children }) => {
    const [templateName, setTemplateName] = useState('template1');
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState('');
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [saveMethod, setSaveMethod] = useState('auto');
    const saveEventRef = useRef(null);
    const exportEventRef = useRef(null);

    const startSaving = () => {
        setIsSaving(true);
    };
    const finishSaving = () => {
        setIsSaving(false);
    };

    const triggerSaveEvent = () => {
        if (saveEventRef.current) {
            saveEventRef.current();
        }
    };

    const triggerExportEvent = (exportDevices) => {
        if (exportEventRef.current) {
            exportEventRef.current(exportDevices);
        }
    };

    const value = {
        templateName,
        setTemplateName,
        isSaving,
        startSaving,
        finishSaving,
        lastSaved,
        setLastSaved,
        selectedDevice,
        setSelectedDevice,
        saveMethod,
        setSaveMethod,
        saveEventRef,
        triggerSaveEvent,
        exportEventRef,
        triggerExportEvent,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};