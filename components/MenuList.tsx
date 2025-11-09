import React from 'react';
import type { MenuItem } from '../types';

interface MenuListProps {
  items: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  checkStockAvailability: (item: MenuItem) => boolean;
}

const MenuItemCard: React.FC<{ item: MenuItem; onAdd: () => void, isAvailable: boolean }> = ({ item, onAdd, isAvailable }) => (
    <button 
      onClick={onAdd}
      disabled={!isAvailable}
      className={`relative bg-surface-card dark:bg-surface-dark-card rounded-lg shadow-md hover:shadow-xl transition-all duration-200 p-4 text-center flex flex-col justify-between aspect-square focus:outline-none focus:ring-2 focus:ring-brand-primary ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {!isAvailable && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          OUT OF STOCK
        </span>
      )}
      <h3 className="font-bold text-sm sm:text-base text-text-main dark:text-text-dark-main">{item.name}</h3>
      <p className="text-text-secondary dark:text-text-dark-secondary text-base font-semibold">Ksh {item.price.toFixed(2)}</p>
    </button>
);

const MenuList: React.FC<MenuListProps> = ({ items, onAddItem, checkStockAvailability }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map(item => (
        <MenuItemCard key={item.id} item={item} onAdd={() => onAddItem(item)} isAvailable={checkStockAvailability(item)} />
      ))}
    </div>
  );
};

export default MenuList;