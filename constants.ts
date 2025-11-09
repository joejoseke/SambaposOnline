import type { MenuItem, Category, User } from './types';

export const USERS: User[] = [
  { id: 'u1', username: 'admin', pin: '1234', role: 'admin' },
  { id: 'u2', username: 'service', pin: '0000', role: 'service' },
];

export const MENU_ITEMS: MenuItem[] = [
  { id: 'm1', name: 'Classic Burger', price: 850, category: 'Burgers' },
  { id: 'm2', name: 'Cheese Burger', price: 950, category: 'Burgers' },
  { id: 'm3', name: 'Bacon Burger', price: 1050, category: 'Burgers' },
  { id: 'm4', name: 'Veggie Burger', price: 800, category: 'Burgers' },
  { id: 'm5', name: 'Margherita Pizza', price: 1200, category: 'Pizzas' },
  { id: 'm6', name: 'Pepperoni Pizza', price: 1400, category: 'Pizzas' },
  { id: 'm7', name: 'BBQ Chicken Pizza', price: 1500, category: 'Pizzas' },
  { id: 'm8', name: 'Caesar Salad', price: 700, category: 'Salads' },
  { id: 'm9', name: 'Greek Salad', price: 750, category: 'Salads' },
  { id: 'm10', name: 'French Fries', price: 350, category: 'Sides' },
  { id: 'm11', name: 'Onion Rings', price: 400, category: 'Sides' },
  { id: 'm12', name: 'Coke', price: 150, category: 'Drinks' },
  { id: 'm13', name: 'Sprite', price: 150, category: 'Drinks' },
  { id: 'm14', name: 'Iced Tea', price: 200, category: 'Drinks' },
  { id: 'm15', name: 'Water', price: 100, category: 'Drinks' },
  { id: 'm16', name: 'Chocolate Cake', price: 550, category: 'Desserts' },
  { id: 'm17', name: 'Cheesecake', price: 600, category: 'Desserts' },
];

export const CATEGORIES: Category[] = [...new Set(MENU_ITEMS.map(item => item.category))];