
import React, { useState } from 'react';
import type { Ticket, MenuItem } from '../types';
import { CATEGORIES, MENU_ITEMS } from '../constants';
import CategoryList from './CategoryList';
import MenuList from './MenuList';
import TicketView from './TicketView';

interface OrderingViewProps {
  ticket: Ticket;
  onAddItem: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onGoToPayment: () => void;
  onClose: () => void;
}

const OrderingView: React.FC<OrderingViewProps> = ({
  ticket,
  onAddItem,
  onUpdateQuantity,
  onGoToPayment,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);

  const filteredMenuItems = MENU_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="h-full flex flex-col md:flex-row bg-surface-main dark:bg-surface-dark">
      {/* Left: Categories */}
      <div className="w-full md:w-1/6 lg:w-1/6 bg-surface-card dark:bg-surface-dark-card border-r border-gray-200 dark:border-gray-700">
        <CategoryList
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Middle: Menu Items */}
      <div className="flex-1 p-4 overflow-y-auto">
        <MenuList items={filteredMenuItems} onAddItem={onAddItem} />
      </div>

      {/* Right: Ticket */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-surface-card dark:bg-surface-dark-card border-l border-gray-200 dark:border-gray-700">
        <TicketView
          ticket={ticket}
          onUpdateQuantity={onUpdateQuantity}
          onGoToPayment={onGoToPayment}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default OrderingView;
