// import { Link, useNavigate } from "react-router-dom";

// import { useLockContext } from "../contexts/LockContext";
// import { FaLock } from "react-icons/fa";

// function MainLayout({ children }) {
//   const { isLocked, lockApp } = useLockContext();
//   const navigate = useNavigate();

//   const clearLock = () => {
//     lockApp();
//     navigate("/");
//   };

//   return (
//     <div>
//       <header className="bg-[#0a1627]">
//         <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
//           <Link to="/">
//             <img src="logo.png" className="w-72" />
//           </Link>
//           <div className="hidden sm:flex gap-3">
//             <button onClick={() => navigate("/pos")}>Orders</button>
//             <button onClick={() => navigate("/sales")}>Sales</button>
//             <button onClick={() => navigate("/inventory")}>Inventory</button>
//           </div>
//           <div className="lock-icon-container" onClick={clearLock}>
//             {!isLocked && (
//               <FaLock
//                 className="hover:text-[#fe0039] transition-colors"
//                 size={32}
//                 style={{ cursor: "pointer" }}
//               />
//             )}
//           </div>
//         </nav>
//       </header>
//       <main className="px-4 py-6">{children}</main>
//     </div>
//   );
// }

// export default MainLayout;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLockContext } from "../contexts/LockContext";
import { FaLock } from "react-icons/fa";

function MainLayout({ children }) {
  const { isLocked, lockApp } = useLockContext();
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setVisible(
      (prevScrollPos > currentScrollPos &&
        prevScrollPos - currentScrollPos > 70) ||
        currentScrollPos < 10
    );
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible]);

  const clearLock = () => {
    lockApp();
    navigate("/");
  };

  return (
    <div>
      <header
        className={`bg-[#0a1627] fixed w-full transition-transform ${
          visible ? "transform translate-y-0" : "transform -translate-y-full"
        } z-10`}
      >
        <nav className="container mx-auto px-4 py-1 flex justify-between items-center">
          <Link to="/">
            <img src="logo.png" className="w-48 sm:w-72 p-1" alt="Logo" />
          </Link>
          <div className="flex items-center">
            <div className="hidden sm:flex gap-3 items-center">
              <button onClick={() => navigate("/pos")}>Orders</button>
              <button onClick={() => navigate("/sales")}>Sales</button>
              <button onClick={() => navigate("/inventory")}>Inventory</button>
            </div>
            <div className="lock-icon-container">
              {!isLocked && (
                <FaLock
                  className="hover:text-[#fe0039] transition-colors cursor-pointer ml-4 text-2xl sm:text-3xl"
                  onClick={clearLock}
                />
              )}
            </div>
          </div>
        </nav>
      </header>
      <main className="p-2 pt-[5.3rem]">{children}</main>
    </div>
  );
}

export default MainLayout;
