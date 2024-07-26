// context/GlobalContext.js
import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const TemplateProvider = ({ children }) => {
    const [templateName, setTemplateName] = useState('template1');
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState('');
    const [selectedDevice, setSelectedDevice] = useState(null);

    const startSaving = () => {
        setIsSaving(true);
    };
    const finishSaving = () => {
        setIsSaving(false);
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
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};