import React, { useState, useCallback, useEffect } from 'react';
import type { User } from '../types';
import { USERS } from '../constants';
import { XCircleIcon, ArrowRightCircleIcon, PowerIcon } from './common/icons';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const KeypadButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`bg-surface-card dark:bg-surface-dark-card rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 p-4 text-center flex flex-col items-center justify-center aspect-square focus:outline-none focus:ring-2 focus:ring-brand-primary text-3xl font-semibold ${className}`}
  >
    {children}
  </button>
);

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleKeyPress = (key: string) => {
    if (pin.length < 4) {
      setPin(pin + key);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleLogin = useCallback(() => {
    if (pin.length === 0) return;
    const foundUser = USERS.find(user => user.pin === pin);

    if (foundUser) {
      setError('');
      onLogin(foundUser);
    } else {
      setError('Invalid PIN');
      setPin('');
      triggerShake();
    }
  }, [pin, onLogin]);
  
  // Allow submitting with Enter key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleLogin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleLogin]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-main dark:bg-surface-dark text-text-main dark:text-text-dark-main">
      <div className="w-full max-w-xs p-4 space-y-6">
        <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Neon Online POS</h1>
            <input
                type="password"
                readOnly
                value={pin}
                placeholder="Enter PIN"
                className={`w-full p-4 text-center text-3xl tracking-[1rem] bg-surface-main dark:bg-surface-dark border-2 rounded-lg focus:outline-none transition-all duration-300 ${shake ? 'animate-shake border-red-500' : 'border-brand-primary/50 focus:border-brand-primary'}`}
                style={{ animation: shake ? 'shake 0.5s' : 'none' }}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[ '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(key => (
            <KeypadButton key={key} onClick={() => handleKeyPress(key)}>{key}</KeypadButton>
          ))}
          <KeypadButton onClick={handleBackspace}><XCircleIcon className="h-8 w-8 text-red-500"/></KeypadButton>
          <KeypadButton onClick={() => handleKeyPress('0')}>0</KeypadButton>
          <KeypadButton onClick={handleLogin}><ArrowRightCircleIcon className="h-8 w-8 text-green-500"/></KeypadButton>
        </div>
        
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
          <p className="font-bold mb-1">For testing:</p>
          <p>Waiter PIN: 1111</p>
          <p>Cashier PIN: 2222</p>
          <p>Procurement PIN: 3333</p>
          <p>Accountant PIN: 4444</p>
          <p>Manager PIN: 5555</p>
          <p>Director PIN: 6666</p>
        </div>
      </div>
       <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default LoginView;