import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import POSPage from "./pages/POSPage";
import { useLockContext } from "./contexts/LockContext";
import { ApiProvider } from "./contexts/ApiContext";
import Sales from "./components/Sales";
import Tables from "./components/Tables";
import Inventory from "./components/Inventory";
import MainLayout from "./layouts/MainLayout";
import { CashProvider } from "./contexts/CashContext";
import CashManagement from "./components/CashManagement";
import Stock from "./components/Stock";

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
  const { isLocked }: { isLocked: boolean } = useLockContext();

  return (
    <ApiProvider>
      <CashProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {isLocked ? (
                <>
                  <Route path="/pos/*" element={<LockedMessage />} />
                  <Route path="/tables" element={<LockedMessage />} />
                  <Route path="/sales" element={<LockedMessage />} />
                  <Route path="/cash" element={<LockedMessage />} />
                  <Route path="/inventory" element={<LockedMessage />} />
                  <Route path="/stock" element={<LockedMessage />} />
                </>
              ) : (
                <>
                  <Route path="/pos" element={<POSPage />} />
                  <Route path="/pos/:tableId" element={<POSPage />} />
                  <Route path="/tables" element={<Tables />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/cash" element={<CashManagement />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/stock" element={<Stock />} />
                </>
              )}
            </Routes>
          </MainLayout>
        </Router>
      </CashProvider>
    </ApiProvider>
  );
}

export default App;
