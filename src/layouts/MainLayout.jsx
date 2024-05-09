import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLockContext } from '../contexts/LockContext';
import { FaLock } from 'react-icons/fa';

function MainLayout({ children }) {
  const { isLocked, lockApp } = useLockContext();
  const navigate = useNavigate();

  const clearLock = () => {
    lockApp();
    navigate('/');
  };

  return (
    <div>
      <header>
        <nav className="navbar navbar-light bg-primary">
          <div className="container">
            <Link to="/" className="navbar-brand fw-bold " style={{ fontSize: "28px", color: 'white' }}>KK Coffee Shop</Link>
          </div>
          <div className="lock-icon-container" style={{marginRight:'200px'}} onClick={clearLock}>
            {!isLocked && <FaLock className='lock-icon' size={32} style={{ cursor: 'pointer' }} />}
          </div>
        </nav>
      </header>
      <main>
        <div className='p-16 mt-3'>
          {children}
        </div>
        <ToastContainer />
      </main>
    </div>
  );
}

export default MainLayout;
