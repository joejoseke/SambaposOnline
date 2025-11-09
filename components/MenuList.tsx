
import React from 'react';
import type { MenuItem } from '../types';

interface MenuListProps {
  items: MenuItem[];
  onAddItem: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<{ item: MenuItem; onAdd: () => void }> = ({ item, onAdd }) => (
    <button 
      onClick={onAdd}
      className="bg-surface-card dark:bg-surface-dark-card rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 p-4 text-center flex flex-col justify-between aspect-square focus:outline-none focus:ring-2 focus:ring-brand-primary"
    >
      <h3 className="font-bold text-md md:text-lg text-text-main dark:text-text-dark-main">{item.name}</h3>
      <p className="text-text-secondary dark:text-text-dark-secondary text-lg">${item.price.toFixed(2)}</p>
    </button>
);


const MenuList: React.FC<MenuListProps> = ({ items, onAddItem }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map(item => (
        <MenuItemCard key={item.id} item={item} onAdd={() => onAddItem(item)} />
      ))}
    </div>
  );
};

export default MenuList;
