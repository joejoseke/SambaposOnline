export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: 'pcs' | 'g' | 'ml';
}

export interface RecipeItem {
  stockItemId: string;
  quantity: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  recipe: RecipeItem[];
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
  paymentMethod?: 'cash' | 'card';
  paidAt?: string;
  userId?: string;
  // ETIMS validation data
  etimsInvoiceNumber?: string;
  verificationCode?: string;
  qrCodeData?: string;
}

export interface Table {
  id: string;
  name: string;
  status: 'available' | 'occupied';
}

export type ViewType = 
  | 'ORDERING' 
  | 'PAYMENT'
  | 'RECEIPT'
  | 'DIRECTOR_DASHBOARD'
  | 'PROCUREMENT_DASHBOARD'
  | 'ACCOUNTANT_DASHBOARD'
  | 'MANAGER_DASHBOARD'
  | 'CASHIER_DASHBOARD';

export type Category = string;

export type UserRole = 'waiter' | 'cashier' | 'director' | 'procurement' | 'accountant' | 'manager';

export interface User {
  id:string;
  role: UserRole;
  pin: string;
}