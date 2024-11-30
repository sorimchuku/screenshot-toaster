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
    const [history, setHistory] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);

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

    const triggerExportEvent = (exportDevices, fileName) => {
        if (exportEventRef.current) {
            exportEventRef.current(exportDevices, fileName);
        }
    };

    const undo = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }

    const redo = () => {
        if (currentStep < history.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    }


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
        history,
        setHistory,
        currentStep,
        setCurrentStep,
        undo,
        redo,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};