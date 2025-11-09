import React from 'react';
import type { UserRole } from '../../types';
import { Squares2X2Icon, PowerIcon, DevicePhoneMobileIcon, SunIcon, MoonIcon } from './icons';

interface HeaderProps {
    userRole: UserRole;
    onLogout: () => void;
    onMobileDashboardClick: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, onLogout, onMobileDashboardClick, theme, onToggleTheme }) => {
  return (
    <header className="bg-brand-primary text-white shadow-lg flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <Squares2X2Icon className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Neon Online POS</h1>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onToggleTheme} className="p-2 rounded-full hover:bg-brand-light transition-colors">
            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
        </button>
        {userRole === 'admin' && (
         <button onClick={onMobileDashboardClick} className="flex items-center gap-2 px-4 py-2 bg-brand-secondary rounded-lg hover:bg-brand-light transition-colors">
            <DevicePhoneMobileIcon className="h-5 w-5" />
            <span className="font-semibold hidden sm:inline">Mobile Report</span>
        </button>
        )}
        <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
            <PowerIcon className="h-5 w-5" />
            <span className="font-semibold hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;