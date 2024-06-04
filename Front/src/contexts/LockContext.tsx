import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { LockContextValue } from "../types/AllTypes";

// Create the lock context with the defined type
const LockContext = createContext<LockContextValue | undefined>(undefined);

// Custom hook to use the lock context
// eslint-disable-next-line react-refresh/only-export-components
export const useLockContext = () => {
  const context = useContext(LockContext);
  if (!context) {
    throw new Error("useLockContext must be used within a LockProvider");
  }
  return context;
};

// Lock provider component
export const LockProvider = ({ children }: { children: ReactNode }) => {
  const [isLocked, setIsLocked] = useState(true);

  // Function to lock the app
  const lockApp = () => {
    localStorage.setItem("isLocked", "true");
    setIsLocked(true);
  };

  // Function to unlock the app
  const unlockApp = () => {
    localStorage.setItem("isLocked", "false");
    setIsLocked(false);
  };

  // Check if the app is locked on component mount
  useEffect(() => {
    const isLockedStored = localStorage.getItem("isLocked");
    setIsLocked(isLockedStored === "true");
  }, []);

  // Provide the context value with the correct type
  const value: LockContextValue = {
    isLocked,
    lockApp,
    unlockApp,
  };

  return <LockContext.Provider value={value}>{children}</LockContext.Provider>;
};
