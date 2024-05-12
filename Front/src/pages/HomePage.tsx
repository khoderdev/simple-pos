import React, { useState, useEffect } from "react";
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
        navigate("/pos"); // Navigate to /pos after unlocking
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
      navigate("/pos"); // Navigate to /pos after unlocking
    } else {
      alert("Invalid PIN. Please try again.");
    }
  };

  const handlePinChange = (e) => {
    setPin(e.target.value);
  };

  return (
    <div className="vh-100 flex flex-col items-center p-5 mt-4 rounded-3 text-center">
      <h1 className="mb-lg-5">Welcome to Karam Café</h1>

      <div className="flex justify-center items-center md:pt-20 gap-14">
        {!isLocked && (
          <Link to="/pos" className="cards md:!p-20">
            <span>POS</span>
          </Link>
        )}
        {!isLocked && (
          <Link to="/sales" className="cards md:!p-16">
            <span>Sales</span>
          </Link>
        )}
      </div>

      {isLocked ? (
        <div className="flex flex-col w-52 justify-center items-center">
          <p className="mb-3 font-medium text-lg">Enter PIN to unlock:</p>
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={handlePinChange}
            className="rounded-md p-2 border border-[#fe0039]"
            autoFocus
            maxLength={4}
          />
          <div
            className="absolute top-[25rem] mb-3 hover:text-[#fff]"
            onClick={handleUnlock}
          >
            <FaLock className=" transition-colors cursor-pointer" size={100} />
            <p className="text-red text-[1rem] font-bold mt-[-2.2rem] select-none cursor-pointer">
              Unlock
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default HomePage;