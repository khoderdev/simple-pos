import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { startingCashAtom, totalSalesAtom, totalAmountAtom } from "../States/store";

const CashManagement = () => {
  const [startingCash, setStartingCash] = useAtom(startingCashAtom);
  const [totalSales, setTotalSales] = useAtom(totalSalesAtom);
  const [totalAmount] = useAtom(totalAmountAtom); // Assuming this atom tracks the total amount of a placed order

  // Initialize 'initialCash' with the value from 'startingCashAtom'
  const [initialCash, setInitialCash] = useState<number>(() => {
    return startingCash !== null ? startingCash : 0;
  });

  const [isDayStarted, setIsDayStarted] = useState<boolean>(false);

  const handleStartDay = () => {
    console.log("Starting day with initial cash:", initialCash);
    setStartingCash(initialCash);
    setTotalSales(0);
    setIsDayStarted(true);
  };

  const handleEndDay = () => {
    console.log("Ending day...");
    if (startingCash === null) {
      console.error("The day has not been started yet.");
      return;
    }

    const report = {
      startingCash,
      endingCash: startingCash + totalSales,
      totalSales,
    };

    console.log("Daily Report:", report);
    alert(
      `Daily Report:\nStarting Cash: ${report.startingCash}\nEnding Cash: ${report.endingCash}\nTotal Sales: ${report.totalSales}`
    );

    setStartingCash(null);
    setTotalSales(0);
    setIsDayStarted(false);
  };

  useEffect(() => {
    if (isDayStarted) {
      setTotalSales(prevSales => prevSales + totalAmount);
    }
  }, [totalAmount, isDayStarted, setTotalSales]);

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex flex-col items-center">
        {!isDayStarted ? (
          <>
            <input
              type="number"
              value={initialCash}
              onChange={(e) => {
                console.log("Updating initial cash:", e.target.value);
                setInitialCash(Number(e.target.value));
              }}
              className="bg-gray-800 text-white px-2 sm:px-4 py-1 sm:py-2 rounded border border-gray-700 mb-2"
              placeholder="Enter starting cash"
            />
            <button
              className="bg-green-500 px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-green-600 text-white"
              onClick={handleStartDay}
            >
              Start Day
            </button>
          </>
        ) : (
          <button
            className="bg-red-500 px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-red-600 text-white"
            onClick={handleEndDay}
          >
            End Day
          </button>
        )}
      </div>
      {isDayStarted && (
        <div className="mt-4 text-center text-white">
          <p className="text-xl">
            Current Cash: {(startingCash || 0) + totalSales} L.L
          </p>
        </div>
      )}
    </div>
  );
};

export default CashManagement;
