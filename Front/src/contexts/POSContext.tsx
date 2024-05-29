import React, { createContext, useState } from "react";
import { useContext } from "react";

// Define types
type Day = {
  id: string;
  orders: Order[];
};

type Order = {
  table: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

type OrderItem = {
  product: string;
  quantity: number;
  totalAmount: number;
};

// Define context
type POSContextType = {
  days: Day[];
  currentDay: Day | null;
  createNewDay: () => void;
  placeOrder: (table: string, order: Order) => void;
};

const POSContext = createContext<POSContextType | undefined>(undefined);

// Define provider
export const POSProvider: React.FC = ({ children }) => {
  const [days, setDays] = useState<Day[]>([]);
  const [currentDay, setCurrentDay] = useState<Day | null>(null);

  const createNewDay = () => {
    console.log('createNewDay Functions Cliked')
    const newDay: Day = {
      id: new Date().toISOString(),
      orders: [],
    };
    setDays((prevDays) => [...prevDays, newDay]);
    setCurrentDay(newDay);
  };

  const placeOrder = (table: string, order: Order) => {
    if (!currentDay) {
      console.error("No current day found.");
      return;
    }
    const updatedDay: Day = {
      ...currentDay,
      orders: [...currentDay.orders, order],
    };
    setDays((prevDays) =>
      prevDays.map((day) => (day.id === currentDay.id ? updatedDay : day))
    );
    setCurrentDay(updatedDay);
  };

  return (
    <POSContext.Provider value={{ days, currentDay, createNewDay, placeOrder }}>
      {children}
    </POSContext.Provider>
  );
};

// Custom hook to access POS context
export const usePOS = () => {
    const context = useContext(POSContext);
    if (!context) {
      throw new Error("usePOS must be used within a POSProvider");
    }
    return context;
  };