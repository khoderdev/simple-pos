import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import POSPage from './pages/POSPage';
import { useLockContext } from './contexts/LockContext';
import Sales from './components/Sales';
import MainLayout from './layouts/MainLayout';

const LockedMessage = () => {
  return (
    <div>
      <h1 className='text-center mt-5 text-danger fw-bold'>You Must Unlock the System First</h1>
      <div className="d-flex justify-content-center mt-3">
        <Link to="/" className="btn btn-primary">Unlock</Link>
      </div>
    </div>
  );
};

function App() {
  const { isLocked } = useLockContext();

  return (
    // <MainLayout>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {isLocked ? (
            <>
              <Route path="/pos" element={<LockedMessage />} />
              <Route path="/sales" element={<LockedMessage />} />
            </>
          ) : (
            <>
              <Route path="/pos" element={<POSPage />} />
              <Route path="/sales" element={<Sales />} />
            </>
          )}
        </Routes>
      </Router>
    // </MainLayout>
  );
}

export default App;
