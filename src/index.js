import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { LockProvider } from './contexts/LockContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <LockProvider>
        <App />
    </LockProvider>
);

