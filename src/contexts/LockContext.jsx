import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the lock context
const LockContext = createContext();

// Custom hook to use the lock context
export const useLockContext = () => useContext(LockContext);

// Lock provider component
export const LockProvider = ({ children }) => {
    const [isLocked, setIsLocked] = useState(true);

    // Function to lock the app
    const lockApp = () => {
        localStorage.setItem('isLocked', 'true');
        setIsLocked(true);
    };

    // Function to unlock the app
    const unlockApp = () => {
        localStorage.setItem('isLocked', 'false');
        setIsLocked(false);
    };

    // Check if the app is locked on component mount
    useEffect(() => {
        const isLockedStored = localStorage.getItem('isLocked');
        setIsLocked(isLockedStored === 'true');
    }, []);

    return (
        <LockContext.Provider value={{ isLocked, lockApp, unlockApp }}>
            {children}
        </LockContext.Provider>
    );
};
