
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

export type ViewType = 'TABLES' | 'ORDERING' | 'PAYMENT' | 'MOBILE_DASHBOARD';

export type Category = string;
