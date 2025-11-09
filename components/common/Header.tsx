
import React from 'react';
import type { ViewType, UserRole } from '../../types';
import { HomeIcon, Squares2X2Icon, PowerIcon, DevicePhoneMobileIcon } from './icons';

interface HeaderProps {
    currentView: ViewType;
    userRole: UserRole;
    onHomeClick: () => void;
    onLogout: () => void;
    onMobileDashboardClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, userRole, onHomeClick, onLogout, onMobileDashboardClick }) => {
  return (
    <header className="bg-brand-primary text-white shadow-lg flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <Squares2X2Icon className="h-8 w-8" />
        <h1 className="text-2xl font-bold">React POS Pro</h1>
      </div>
      <div className="flex items-center gap-4">
        {currentView !== 'TABLES' && (
          <button onClick={onHomeClick} className="flex items-center gap-2 px-4 py-2 bg-brand-secondary rounded-lg hover:bg-brand-light transition-colors">
              <HomeIcon className="h-5 w-5" />
              <span className="font-semibold hidden sm:inline">Tables</span>
          </button>
        )}
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