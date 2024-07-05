// context/GlobalContext.js
import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const TemplateProvider = ({ children }) => {
    const [templateName, setTemplateName] = useState('');

    return (
        <GlobalContext.Provider value={{ templateName, setTemplateName }}>
            {children}
        </GlobalContext.Provider>
    );
};