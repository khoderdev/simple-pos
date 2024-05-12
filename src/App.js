import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import POSPage from "./pages/POSPage";
import { useLockContext } from "./contexts/LockContext";
import Sales from "./components/Sales";
import AddNewProducts from "./components/AddNewProducts";

const LockedMessage = () => {
  return (
    <div>
      <h1 className="text-center mt-5 text-danger fw-bold">
        You Must Unlock the System First
      </h1>
      <div className="d-flex justify-content-center mt-3">
        <Link to="/" className="btn btn-primary">
          Unlock
        </Link>
      </div>
    </div>
  );
};

function App() {
  const { isLocked } = useLockContext();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {isLocked ? (
          <>
            <Route path="/pos" element={<LockedMessage />} />
            <Route path="/sales" element={<LockedMessage />} />
            <Route path="/add-products" element={<LockedMessage />} />
          </>
        ) : (
          <>
            <Route path="/pos" element={<POSPage />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/add-products" element={<AddNewProducts />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
