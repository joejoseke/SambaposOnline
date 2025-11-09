import React, { useState, useMemo } from 'react';
import type { Ticket, MenuItem, UserRole } from '../types';
import { CATEGORIES } from '../constants';
import CategoryList from './CategoryList';
import MenuList from './MenuList';
import TicketView from './TicketView';
import { MagnifyingGlassIcon, Bars3Icon, TicketIcon } from './common/icons';

interface OrderingViewProps {
  ticket: Ticket;
  userRole: UserRole;
  onAddItem: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onGoToPayment: () => void;
  onClose: () => void;
  menuItems: MenuItem[];
  checkStockAvailability: (item: MenuItem) => boolean;
}

const OrderingView: React.FC<OrderingViewProps> = ({
  ticket,
  userRole,
  onAddItem,
  onUpdateQuantity,
  onGoToPayment,
  onClose,
  menuItems,
  checkStockAvailability
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileView, setMobileView] = useState<'menu' | 'ticket'>('menu');

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const inCategory = item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return inCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, menuItems]);

  // Mobile View
  const MobileLayout = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {mobileView === 'menu' ? (
          <div>
            <CategoryList
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
             <div className="p-4">
               <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-surface-card dark:bg-surface-dark-card focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="px-4 pb-4">
              <MenuList items={filteredMenuItems} onAddItem={onAddItem} checkStockAvailability={checkStockAvailability} />
            </div>
          </div>
        ) : (
          <TicketView
            ticket={ticket}
            onUpdateQuantity={onUpdateQuantity}
            onGoToPayment={onGoToPayment}
            onClose={onClose}
            userRole={userRole}
          />
        )}
      </div>
      {/* Bottom Navigation */}
      <div className="flex-shrink-0 grid grid-cols-2 gap-px bg-gray-200 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setMobileView('menu')}
          className={`flex flex-col items-center justify-center p-3 transition-colors ${mobileView === 'menu' ? 'bg-brand-primary text-white' : 'bg-surface-card dark:bg-surface-dark-card'}`}
        >
          <Bars3Icon className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Menu</span>
        </button>
        <button
          onClick={() => setMobileView('ticket')}
          className={`flex flex-col items-center justify-center p-3 transition-colors ${mobileView === 'ticket' ? 'bg-brand-primary text-white' : 'bg-surface-card dark:bg-surface-dark-card'}`}
        >
          <TicketIcon className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Ticket ({ticket.items.reduce((sum, i) => sum + i.quantity, 0)})</span>
        </button>
      </div>
    </div>
  );

  // Desktop View
  const DesktopLayout = () => (
    <div className="h-full flex flex-row">
      <div className="w-1/6 bg-surface-card dark:bg-surface-dark-card border-r border-gray-200 dark:border-gray-700">
        <CategoryList
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-surface-card dark:bg-surface-dark-card focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1 overflow-y-auto">
           <MenuList items={filteredMenuItems} onAddItem={onAddItem} checkStockAvailability={checkStockAvailability} />
        </div>
      </div>
      
      <div className="w-1/3 lg:w-1/4 bg-surface-card dark:bg-surface-dark-card border-l border-gray-200 dark:border-gray-700">
        <TicketView
          ticket={ticket}
          onUpdateQuantity={onUpdateQuantity}
          onGoToPayment={onGoToPayment}
          onClose={onClose}
          userRole={userRole}
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden h-full">
        <MobileLayout />
      </div>
      <div className="hidden md:flex h-full">
        <DesktopLayout />
      </div>
    </>
  );
};

export default OrderingView;