
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { Ticket, MenuItem, ViewType, TicketItem, User, StockItem, UserRole } from './types';
import OrderingView from './components/OrderingView';
import PaymentView from './components/PaymentView';
import Header from './components/common/Header';
import LoginView from './components/LoginView';
import MobileDashboardView from './components/MobileDashboardView';
import ProcurementView from './components/ProcurementView';
import AccountantView from './components/AccountantView';
import ManagerView from './components/ManagerView';
import { MENU_ITEMS, STOCK_ITEMS } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Map<string, Ticket>>(new Map());
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('ORDERING');
  const [stockItems, setStockItems] = useState<StockItem[]>(STOCK_ITEMS);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const activeTicket = useMemo(() => {
    if (!activeTicketId) return null;
    return tickets.get(activeTicketId) || null;
  }, [activeTicketId, tickets]);

  const paidTickets = useMemo(() => {
    // FIX: Changed `Array.from(tickets.values())` to `[...tickets.values()]` to resolve a TypeScript type inference issue where `t` was inferred as `unknown`. The spread syntax correctly infers the type of `t` as `Ticket`.
    return [...tickets.values()].filter(t => t.status === 'paid');
  }, [tickets]);
  
  const startNewOrder = useCallback(() => {
    const newTicketId = `T-${Date.now()}`;
    const newTicket: Ticket = {
      id: newTicketId, tableId: 'counter', items: [], total: 0, subtotal: 0, tax: 0, status: 'open',
    };
    setTickets(prevTickets => new Map(prevTickets).set(newTicketId, newTicket));
    setActiveTicketId(newTicketId);
    setCurrentView('ORDERING');
  }, []);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    switch (user.role) {
      case 'director':
        setCurrentView('DIRECTOR_DASHBOARD');
        break;
      case 'manager':
        setCurrentView('MANAGER_DASHBOARD');
        break;
      case 'accountant':
        setCurrentView('ACCOUNTANT_DASHBOARD');
        break;
      case 'procurement':
        setCurrentView('PROCUREMENT_DASHBOARD');
        break;
      default:
        startNewOrder();
        break;
    }
  }, [startNewOrder]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setActiveTicketId(null);
  }, []);

  const updateTicketTotals = (items: TicketItem[]): { subtotal: number, tax: number, total: number } => {
    const subtotal = items.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const checkStockAvailability = useCallback((menuItem: MenuItem): boolean => {
    for (const ingredient of menuItem.recipe) {
      const stockItem = stockItems.find(si => si.id === ingredient.stockItemId);
      if (!stockItem || stockItem.quantity < ingredient.quantity) {
        return false;
      }
    }
    return true;
  }, [stockItems]);

  const adjustStock = (items: TicketItem[], factor: 1 | -1) => {
    const newStockItems = [...stockItems];
    let stockChanged = false;

    items.forEach(ticketItem => {
        ticketItem.menuItem.recipe.forEach(ingredient => {
            const stockIndex = newStockItems.findIndex(si => si.id === ingredient.stockItemId);
            if (stockIndex !== -1) {
                newStockItems[stockIndex] = {
                    ...newStockItems[stockIndex],
                    quantity: newStockItems[stockIndex].quantity + (ingredient.quantity * ticketItem.quantity * factor),
                };
                stockChanged = true;
            }
        });
    });
    if (stockChanged) setStockItems(newStockItems);
  };
  
  const handleAddItemToTicket = useCallback((item: MenuItem) => {
    if (!activeTicketId) return;
    if (!checkStockAvailability(item)) {
        alert(`${item.name} is out of stock.`);
        return;
    }

    setTickets(prevTickets => {
      const newTickets = new Map<string, Ticket>(prevTickets);
      const ticket = newTickets.get(activeTicketId);
      if (!ticket) return prevTickets;

      const existingItem = ticket.items.find(ticketItem => ticketItem.menuItem.id === item.id);
      let newItems: TicketItem[];

      if (existingItem) {
        newItems = ticket.items.map(ticketItem =>
          ticketItem.menuItem.id === item.id ? { ...ticketItem, quantity: ticketItem.quantity + 1 } : ticketItem
        );
      } else {
        newItems = [...ticket.items, { menuItem: item, quantity: 1 }];
      }
      
      adjustStock([{menuItem: item, quantity: 1}], -1);
      const { subtotal, tax, total } = updateTicketTotals(newItems);
      newTickets.set(activeTicketId, { ...ticket, items: newItems, subtotal, tax, total });
      return newTickets;
    });
  }, [activeTicketId, checkStockAvailability]);

  const handleUpdateItemQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (!activeTicketId) return;

    setTickets(prevTickets => {
        const newTickets = new Map<string, Ticket>(prevTickets);
        const ticket = newTickets.get(activeTicketId);
        if (!ticket) return prevTickets;

        const currentItem = ticket.items.find(item => item.menuItem.id === itemId);
        if (!currentItem) return prevTickets;

        const quantityChange = newQuantity - currentItem.quantity;
        
        if (quantityChange > 0) {
            for (const ingredient of currentItem.menuItem.recipe) {
                const stockItem = stockItems.find(si => si.id === ingredient.stockItemId);
                if (!stockItem || stockItem.quantity < ingredient.quantity * quantityChange) {
                    alert(`Not enough stock to add more ${currentItem.menuItem.name}.`);
                    return prevTickets;
                }
            }
        }
        
        adjustStock([{menuItem: currentItem.menuItem, quantity: quantityChange}], -1);

        let newItems = ticket.items.map(item =>
            item.menuItem.id === itemId ? { ...item, quantity: newQuantity } : item
        ).filter(item => item.quantity > 0);
        
        const { subtotal, tax, total } = updateTicketTotals(newItems);
        newTickets.set(activeTicketId, { ...ticket, items: newItems, subtotal, tax, total });
        return newTickets;
    });
  }, [activeTicketId, stockItems]);
  
  const handleGoToPayment = useCallback(() => {
    if (currentUser?.role !== 'cashier') {
      alert("You do not have permission to process payments.");
      return;
    }
    if (activeTicket && activeTicket.items.length > 0) setCurrentView('PAYMENT');
    else alert("Cannot proceed to payment with an empty ticket.");
  }, [activeTicket, currentUser]);

  const handleProcessPayment = useCallback((paymentMethod: 'cash' | 'card') => {
    if (!activeTicket) return;

    setTickets(prevTickets => {
      const newTickets = new Map<string, Ticket>(prevTickets);
      const ticket = newTickets.get(activeTicket.id);
      if (ticket) {
        const updatedTicket = { ...ticket, status: 'paid' as const, paymentMethod, paidAt: new Date().toISOString() };
        newTickets.set(activeTicket.id, updatedTicket);
      }
      return newTickets;
    });

    startNewOrder();
  }, [activeTicket, startNewOrder]);

  const handleCancelOrder = useCallback(() => {
    if (activeTicket && activeTicket.items.length > 0) {
        if (window.confirm('Are you sure you want to cancel this order? Items will be returned to stock.')) {
            adjustStock(activeTicket.items, 1);
            startNewOrder();
        }
    } else {
        startNewOrder();
    }
  }, [activeTicket, startNewOrder]);
  
  const handleUpdateStock = (stockItemId: string, newQuantity: number) => {
    setStockItems(prevStock =>
      prevStock.map(item =>
        item.id === stockItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleAddStockItem = (newItem: Omit<StockItem, 'id'>) => {
    setStockItems(prevStock => [
      ...prevStock,
      { ...newItem, id: `si-${Date.now()}` },
    ]);
  };


  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }
  
  const isDashboardView = ['DIRECTOR_DASHBOARD', 'MANAGER_DASHBOARD', 'ACCOUNTANT_DASHBOARD', 'PROCUREMENT_DASHBOARD'].includes(currentView);

  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-surface-main dark:bg-surface-dark text-text-main dark:text-text-dark-main overflow-hidden">
      {!isDashboardView && (
        <Header 
          userRole={currentUser.role}
          onLogout={handleLogout} 
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      <main className="flex-1 overflow-hidden">
        {(() => {
          switch(currentView) {
            case 'ORDERING':
              return activeTicket && (
                <OrderingView
                  ticket={activeTicket}
                  onAddItem={handleAddItemToTicket}
                  onUpdateQuantity={handleUpdateItemQuantity}
                  onGoToPayment={handleGoToPayment}
                  onClose={handleCancelOrder}
                  userRole={currentUser.role}
                  menuItems={MENU_ITEMS}
                  checkStockAvailability={checkStockAvailability}
                />
              );
            case 'PAYMENT':
              return activeTicket && (
                <PaymentView
                  ticket={activeTicket}
                  onProcessPayment={handleProcessPayment}
                  onBack={() => setCurrentView('ORDERING')}
                />
              );
            case 'DIRECTOR_DASHBOARD':
              return <MobileDashboardView paidTickets={paidTickets} onLogout={handleLogout} />;
            case 'MANAGER_DASHBOARD':
              return <ManagerView paidTickets={paidTickets} stockItems={stockItems} onLogout={handleLogout} />;
            case 'ACCOUNTANT_DASHBOARD':
              return <AccountantView paidTickets={paidTickets} onLogout={handleLogout} />;
            case 'PROCUREMENT_DASHBOARD':
              return <ProcurementView stockItems={stockItems} onUpdateStock={handleUpdateStock} onAddStockItem={handleAddStockItem} onLogout={handleLogout} />;
            default:
              return null;
          }
        })()}
      </main>
    </div>
  );
};

export default App;