import  { useState, useEffect, SetStateAction } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { useLockContext } from "../contexts/LockContext";

function HomePage() {
  const [pin, setPin] = useState("");
  const { isLocked, unlockApp } = useLockContext(); // Get isLocked state and unlockApp function
  const navigate = useNavigate();

  useEffect(() => {
    const unlockOnCorrectPin = () => {
      if (pin === "3333" && pin.length === 4) {
        unlockApp(); // Unlock the app
        navigate("/tables"); // Navigate to /pos after unlocking
      }
    };

    if (isLocked) {
      // Listen for changes in the PIN
      document.addEventListener("input", unlockOnCorrectPin);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("input", unlockOnCorrectPin);
    };
  }, [pin, isLocked, unlockApp, navigate]);

  const handleUnlock = () => {
    // Check if PIN is correct (e.g., 3333)
    if (pin === "3333") {
      unlockApp(); // Unlock the app
      navigate("/tables"); // Navigate to /pos after unlocking
    } else {
      alert("Invalid PIN. Please try again.");
    }
  };

  const handlePinChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setPin(e.target.value);
  };

  return (
    <div className="h-full flex flex-col items-center justify-start px-5">
      <h1 className="mb-10 mt-2"> <span className="text-6xl font-medium text-center">Welcome</span></h1>

      <div className="flex flex-wrap justify-center gap-12">
        {!isLocked && (
          <Link to="/tables" className="cards !p-10">
            Tables
          </Link>
        )}
        {!isLocked && (
          <Link to="/sales" className="cards ">
            Sales
          </Link>
        )}
      </div>

      {isLocked ? (
        <div className="mt-8 w-full max-w-xs lg:max-w-sm">
          <p className="mb-3 font-medium text-lg">Enter PIN to unlock:</p>
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={handlePinChange}
            className="rounded-md p-2 border border-[#fe0039] w-full"
            autoFocus
            maxLength={4}
          />
          <div className="mt-4 flex items-center justify-center">
            <FaLock
              className="text-red-500 mr-2 transition-colors cursor-pointer"
              size={24}
            />
            <button
              className="text-red-500 font-bold text-sm hover:text-red-700 focus:outline-none"
              onClick={handleUnlock}
            >
              Unlock
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default HomePage;
