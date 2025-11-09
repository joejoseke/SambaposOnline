import type { MenuItem, Category, User, StockItem } from './types';

export const USERS: User[] = [
  { id: 'u1', pin: '1111', role: 'waiter' },
  { id: 'u2', pin: '2222', role: 'cashier' },
  { id: 'u3', pin: '3333', role: 'procurement' },
  { id: 'u4', pin: '4444', role: 'accountant' },
  { id: 'u5', pin: '5555', role: 'manager' },
  { id: 'u6', pin: '6666', role: 'director' },
];

export const STOCK_ITEMS: StockItem[] = [
  { id: 'si1', name: 'Burger Patty', quantity: 50, unit: 'pcs' },
  { id: 'si2', name: 'Bun', quantity: 100, unit: 'pcs' },
  { id: 'si3', name: 'Cheese Slice', quantity: 80, unit: 'pcs' },
  { id: 'si4', name: 'Bacon Strip', quantity: 60, unit: 'pcs' },
  { id: 'si5', name: 'Veggie Patty', quantity: 30, unit: 'pcs' },
  { id: 'si6', name: 'Pizza Dough', quantity: 40, unit: 'pcs' },
  { id: 'si7', name: 'Tomato Sauce', quantity: 5000, unit: 'g' },
  { id: 'si8', name: 'Mozzarella Cheese', quantity: 4000, unit: 'g' },
  { id: 'si9', name: 'Pepperoni', quantity: 1000, unit: 'g' },
  { id: 'si10', name: 'BBQ Chicken', quantity: 2000, unit: 'g' },
  { id: 'si11', name: 'Lettuce', quantity: 3000, unit: 'g' },
  { id: 'si12', name: 'Tomato', quantity: 50, unit: 'pcs' },
  { id: 'si13', name: 'Potato', quantity: 10000, unit: 'g' },
  { id: 'si14', name: 'Onion', quantity: 50, unit: 'pcs' },
  { id: 'si15', name: 'Coke Syrup', quantity: 10000, unit: 'ml' },
  { id: 'si16', name: 'Sprite Syrup', quantity: 10000, unit: 'ml' },
  { id: 'si17', name: 'Tea Leaves', quantity: 500, unit: 'g' },
  { id: 'si18', name: 'Bottled Water', quantity: 100, unit: 'pcs' },
  { id: 'si19', name: 'Chocolate Cake Slice', quantity: 20, unit: 'pcs' },
  { id: 'si20', name: 'Cheesecake Slice', quantity: 20, unit: 'pcs' },
];

export const MENU_ITEMS: MenuItem[] = [
  { id: 'm1', name: 'Classic Burger', price: 850, category: 'Burgers', recipe: [{ stockItemId: 'si1', quantity: 1 }, { stockItemId: 'si2', quantity: 1 }, { stockItemId: 'si11', quantity: 50 }, { stockItemId: 'si12', quantity: 1 }] },
  { id: 'm2', name: 'Cheese Burger', price: 950, category: 'Burgers', recipe: [{ stockItemId: 'si1', quantity: 1 }, { stockItemId: 'si2', quantity: 1 }, { stockItemId: 'si3', quantity: 1 }] },
  { id: 'm3', name: 'Bacon Burger', price: 1050, category: 'Burgers', recipe: [{ stockItemId: 'si1', quantity: 1 }, { stockItemId: 'si2', quantity: 1 }, { stockItemId: 'si3', quantity: 1 }, { stockItemId: 'si4', quantity: 2 }] },
  { id: 'm4', name: 'Veggie Burger', price: 800, category: 'Burgers', recipe: [{ stockItemId: 'si5', quantity: 1 }, { stockItemId: 'si2', quantity: 1 }] },
  { id: 'm5', name: 'Margherita Pizza', price: 1200, category: 'Pizzas', recipe: [{ stockItemId: 'si6', quantity: 1 }, { stockItemId: 'si7', quantity: 100 }, { stockItemId: 'si8', quantity: 80 }] },
  { id: 'm6', name: 'Pepperoni Pizza', price: 1400, category: 'Pizzas', recipe: [{ stockItemId: 'si6', quantity: 1 }, { stockItemId: 'si7', quantity: 100 }, { stockItemId: 'si8', quantity: 80 }, { stockItemId: 'si9', quantity: 50 }] },
  { id: 'm7', name: 'BBQ Chicken Pizza', price: 1500, category: 'Pizzas', recipe: [{ stockItemId: 'si6', quantity: 1 }, { stockItemId: 'si7', quantity: 100 }, { stockItemId: 'si8', quantity: 80 }, { stockItemId: 'si10', quantity: 100 }] },
  { id: 'm8', name: 'Caesar Salad', price: 700, category: 'Salads', recipe: [{ stockItemId: 'si11', quantity: 200 }] },
  { id: 'm9', name: 'Greek Salad', price: 750, category: 'Salads', recipe: [{ stockItemId: 'si11', quantity: 150 }, { stockItemId: 'si12', quantity: 1 }] },
  { id: 'm10', name: 'French Fries', price: 350, category: 'Sides', recipe: [{ stockItemId: 'si13', quantity: 300 }] },
  { id: 'm11', name: 'Onion Rings', price: 400, category: 'Sides', recipe: [{ stockItemId: 'si14', quantity: 1 }] },
  { id: 'm12', name: 'Coke', price: 150, category: 'Drinks', recipe: [{ stockItemId: 'si15', quantity: 300 }] },
  { id: 'm13', name: 'Sprite', price: 150, category: 'Drinks', recipe: [{ stockItemId: 'si16', quantity: 300 }] },
  { id: 'm14', name: 'Iced Tea', price: 200, category: 'Drinks', recipe: [{ stockItemId: 'si17', quantity: 10 }] },
  { id: 'm15', 'name': 'Water', price: 100, category: 'Drinks', recipe: [{ stockItemId: 'si18', quantity: 1 }] },
  { id: 'm16', name: 'Chocolate Cake', price: 550, category: 'Desserts', recipe: [{ stockItemId: 'si19', quantity: 1 }] },
  { id: 'm17', name: 'Cheesecake', price: 600, category: 'Desserts', recipe: [{ stockItemId: 'si20', quantity: 1 }] },
];

export const CATEGORIES: Category[] = [...new Set(MENU_ITEMS.map(item => item.category))];