import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { useLockContext } from '../contexts/LockContext';
import Sales from '../components/Sales'

function HomePage() {
  const [pin, setPin] = useState('');
  const { isLocked, unlockApp } = useLockContext(); // Get isLocked state and unlockApp function
  const navigate = useNavigate();

  const handleUnlock = () => {
    // Check if PIN is correct (e.g., 3333)
    if (pin === '3333') {
      unlockApp(); // Unlock the app
      navigate('/pos'); // Navigate to /pos after unlocking
    } else {
      alert('Invalid PIN. Please try again.');
    }
  };

  const handlePinChange = (e) => {
    setPin(e.target.value);
  };

  const handleKeyPress = (e) => {
    // Check if Enter key is pressed (key code 13)
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <MainLayout>
      <div className='vh-100 bg-light p-5 mt-4 rounded-3 text-center'>
        <h1 className="mb-lg-5">KK Coffee Shop system</h1>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '25px' }}>
          {!isLocked && (
            <Link to='/pos' className="card btn btn-outline-primary" style={{ width: '200px', height: '150px', fontSize: '24px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', color: '#000' }}>
              <span>POS</span>
            </Link>
          )}
          {!isLocked && (
            <Link to='/sales' className="card btn btn-outline-primary" style={{ width: '200px', height: '150px', fontSize: '24px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', color: '#000' }}>
              <span>Sales</span>
            </Link>
          )}
        </div>

        {isLocked ? (
          <div className="mx-auto" style={{ maxWidth: "300px" }}>
            <p className="mb-3">Enter PIN to unlock:</p>
            <input
              type='password'
              placeholder='Enter PIN'
              value={pin}
              onChange={handlePinChange}
              onKeyDown={handleKeyPress}
              className='form-control mb-3'
              autoFocus
            />
            <div className="lock-icon-container mb-3" onClick={handleUnlock}>
              <FaLock className='lock-icon' size={42} style={{ cursor: 'pointer' }} />
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
}

export default HomePage;
