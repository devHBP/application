import React, { createContext, useState, useEffect, useContext } from 'react';

const CountdownContext = createContext();

export const CountdownProvider = ({ children }) => {
    const [countdown, setCountdown] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false); 

    useEffect(() => {
        let interval;
        if (isActive && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        } else if (isActive && countdown === 0) {
            setIsActive(false); // Arrêter le compteur quand il atteint 0
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, countdown]);

    const resetCountdown = () => {
        setCountdown(300);
        setIsActive(true);
    };

    const stopCountdown = () => {
        setCountdown(0);
        setIsActive(false);
    };

    const countDownNull = () => {
        setCountdown(null);
        setIsActive(false);
    };
    const resetForPaiementCountdown = () => {
        setCountdown(1200);
        setIsActive(true);
    };

    return (
        <CountdownContext.Provider value={{ countdown, isActive, isOrderPlaced, resetCountdown, stopCountdown, countDownNull, resetForPaiementCountdown }}>
            {children}
        </CountdownContext.Provider>
    );
};

export const useCountdown = () => useContext(CountdownContext);