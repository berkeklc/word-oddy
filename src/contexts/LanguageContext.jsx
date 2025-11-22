import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('wordOdysseyLanguage');
        return savedLanguage || 'en';
    });

    useEffect(() => {
        localStorage.setItem('wordOdysseyLanguage', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'tr' : 'en');
    };

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        isEnglish: language === 'en',
        isTurkish: language === 'tr'
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
