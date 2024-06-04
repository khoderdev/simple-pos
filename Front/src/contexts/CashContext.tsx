import { createContext, useContext, ReactNode } from "react";
import { useAtom } from "jotai";
import { CashContextValue, DailyReport } from "../types/AllTypes";
import { startingCashAtom, totalSalesAtom } from "../States/store";

const CashContext = createContext<CashContextValue | undefined>(undefined);

export const CashProvider = ({ children }: { children: ReactNode }) => {
  const [startingCash,setStartingCash] = useAtom(startingCashAtom);
  const [totalSales, setTotalSales] = useAtom(totalSalesAtom);

  const startDay = (initialCash: number) => {
    setStartingCash(initialCash);
    setTotalSales(0);
  };

  const endDay = (): DailyReport => {
    const currentStartingCash = startingCash;
    if (currentStartingCash === null) {
      throw new Error("The day has not been started yet.");
    }

    const report: DailyReport = {
      startingCash: currentStartingCash,
      endingCash: currentStartingCash + totalSales,
      totalSales: totalSales,
    };
    setStartingCash(null);
    setTotalSales(0);
    return report;
  };

  const contextValue: CashContextValue = {
    cash: (startingCash !== null ? startingCash : 0) + totalSales,
    startDay,
    endDay,
  };

  return (
    <CashContext.Provider value={contextValue}>{children}</CashContext.Provider>
  );
};

export const useCash = () => {
  const context = useContext(CashContext);
  if (context === undefined) {
    throw new Error("useCash must be used within a CashProvider");
  }
  return context;
};
export { startingCashAtom };
