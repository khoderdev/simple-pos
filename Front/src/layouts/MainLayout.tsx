import { Link, useNavigate } from "react-router-dom";

import { useLockContext } from "../contexts/LockContext";
import { FaLock } from "react-icons/fa";

function MainLayout({ children }) {
  const { isLocked, lockApp } = useLockContext();
  const navigate = useNavigate();

  const clearLock = () => {
    lockApp();
    navigate("/");
  };

  return (
    <div>
      <header className="bg-[#0a1627]">
        <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Link to="/">
            <img src="logo.png" className="w-72" />
          </Link>
          <div className="hidden sm:flex gap-3">
            <button onClick={() => navigate("/pos")}>Orders</button>
            <button onClick={() => navigate("/sales")}>Sales</button>
            <button onClick={() => navigate("/inventory")}>Inventory</button>
          </div>
          <div className="lock-icon-container" onClick={clearLock}>
            {!isLocked && (
              <FaLock
                className="hover:text-[#fe0039] transition-colors"
                size={32}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
        </nav>
      </header>
      <main className="px-4 py-6">{children}</main>
    </div>
  );
}

export default MainLayout;
