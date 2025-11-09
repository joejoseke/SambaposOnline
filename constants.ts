
import type { MenuItem, Table, Category } from './types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 'm1', name: 'Classic Burger', price: 12.99, category: 'Burgers' },
  { id: 'm2', name: 'Cheese Burger', price: 13.99, category: 'Burgers' },
  { id: 'm3', name: 'Bacon Burger', price: 14.99, category: 'Burgers' },
  { id: 'm4', name: 'Veggie Burger', price: 11.99, category: 'Burgers' },
  { id: 'm5', name: 'Margherita Pizza', price: 15.99, category: 'Pizzas' },
  { id: 'm6', name: 'Pepperoni Pizza', price: 17.99, category: 'Pizzas' },
  { id: 'm7', name: 'BBQ Chicken Pizza', price: 18.99, category: 'Pizzas' },
  { id: 'm8', name: 'Caesar Salad', price: 9.99, category: 'Salads' },
  { id: 'm9', name: 'Greek Salad', price: 10.99, category: 'Salads' },
  { id: 'm10', name: 'French Fries', price: 4.99, category: 'Sides' },
  { id: 'm11', name: 'Onion Rings', price: 5.99, category: 'Sides' },
  { id: 'm12', name: 'Coke', price: 2.99, category: 'Drinks' },
  { id: 'm13', name: 'Sprite', price: 2.99, category: 'Drinks' },
  { id: 'm14', name: 'Iced Tea', price: 2.99, category: 'Drinks' },
  { id: 'm15', name: 'Water', price: 1.99, category: 'Drinks' },
  { id: 'm16', name: 'Chocolate Cake', price: 7.99, category: 'Desserts' },
  { id: 'm17', name: 'Cheesecake', price: 8.99, category: 'Desserts' },
];

export const CATEGORIES: Category[] = [...new Set(MENU_ITEMS.map(item => item.category))];

export const TABLES_DATA: Table[] = [
  { id: 't1', name: 'Table 1', status: 'available' },
  { id: 't2', name: 'Table 2', status: 'available' },
  { id: 't3', name: 'Table 3', status: 'occupied' },
  { id: 't4', name: 'Table 4', status: 'available' },
  { id: 't5', name: 'Table 5', status: 'available' },
  { id: 't6', name: 'Table 6', status: 'available' },
  { id: 't7', name: 'Table 7', status: 'available' },
  { id: 't8', name: 'Table 8', status: 'occupied' },
  { id: 't9', name: 'Patio 1', status: 'available' },
  { id: 't10', name: 'Patio 2', status: 'available' },
  { id: 't11', name: 'Bar 1', status: 'available' },
  { id: 't12', name: 'Bar 2', status: 'available' },
];
