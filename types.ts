export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface TicketItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Ticket {
  id: string;
  tableId: string;
  items: TicketItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'open' | 'paid' | 'void';
}

export interface Table {
  id: string;
  name: string;
  status: 'available' | 'occupied';
}

export type ViewType = 'ORDERING' | 'PAYMENT' | 'MOBILE_DASHBOARD';

export type Category = string;

export type UserRole = 'waiter' | 'cashier' | 'director';

export interface User {
  id:string;
  role: UserRole;
  pin: string;
}