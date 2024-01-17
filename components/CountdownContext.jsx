// CountdownContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const CountdownContext = createContext();

export const CountdownProvider = ({ children }) => {
    const [countdown, setCountdown] = useState(300);
    const [isActive, setIsActive] = useState(false);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false); 


    useEffect(() => {
        let interval;
        if (isActive) {
            interval = setInterval(() => {
                setCountdown(prevCountdown => {
                    if (prevCountdown === 1) {
                        setIsActive(false); // Arrêter le compteur quand il atteint 0
                    }
                    return Math.max(prevCountdown - 1, 0);
                });
            }, 1000);
        }
        
        return () => clearInterval(interval);
    }, [isActive]);

    const resetCountdown = () => {
        setCountdown(300);
        setIsActive(true); // Activer le compteur lors de la réinitialisation
    };

    const stopCountdown = () => {
        setCountdown(0);
        setIsActive(false); // Désactiver le compteur
    };

   
    return (
        <CountdownContext.Provider value={{ }}>
            {children}
        </CountdownContext.Provider>
    );
};

export const useCountdown = () => useContext(CountdownContext);
