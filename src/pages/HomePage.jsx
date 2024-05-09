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
      <div className='bg-light p-5 mt-4 rounded-3 text-center'>
        <h1 className="mb-4">KK Coffee Shop</h1>
        <div className="lock-icon-container" >
          {!isLocked && <Link to='/pos' className="btn btn-primary p-2 mb-3" style={{ width: '100px', fontSize: '30px' }}>POS</Link>}
        </div>
        <Link to='/sales' className="btn btn-primary p-2 mb-3" style={{ width: '100px', fontSize: '30px' }}>Sales</Link>
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
