// context/GlobalContext.js
import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const TemplateProvider = ({ children }) => {
    const [templateName, setTemplateName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState('');

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
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};