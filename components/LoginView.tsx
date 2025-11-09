
import React, { useState } from 'react';
import { Squares2X2Icon } from './common/icons';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials for demonstration
    if (username === 'admin' && password === 'password') {
      setError('');
      onLogin();
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-main dark:bg-surface-dark">
      <div className="w-full max-w-md p-8 space-y-8 bg-surface-card dark:bg-surface-dark-card rounded-xl shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 text-brand-primary dark:text-brand-light mb-4">
            <Squares2X2Icon className="h-10 w-10" />
            <h1 className="text-4xl font-bold">React POS Pro</h1>
          </div>
          <p className="text-text-secondary dark:text-text-dark-secondary">Please sign in to continue</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-text-main dark:text-text-dark-main bg-surface-main dark:bg-surface-dark-card rounded-t-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password-input" className="sr-only">Password</label>
              <input
                id="password-input"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-text-main dark:text-text-dark-main bg-surface-main dark:bg-surface-dark-card rounded-b-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light"
            >
              Sign in
            </button>
          </div>
          <div className="text-center text-sm text-gray-500">
            <p>Use <strong>admin</strong> / <strong>password</strong> to login.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
