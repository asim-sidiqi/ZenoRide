import React, { createContext, useState, useContext } from 'react';
import { useEffect } from 'react';


export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {

    const [ captain, setCaptain ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const updateCaptain = (captainData) => {
        setCaptain(captainData);
    };

    useEffect(() => {
        const stored = localStorage.getItem('captain');
        if (stored) {
            setCaptain(JSON.parse(stored));
        }
    }, []);

    const value = {
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain
    };

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;