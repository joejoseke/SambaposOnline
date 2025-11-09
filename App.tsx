import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { Ticket, MenuItem, ViewType, TicketItem, User } from './types';
import OrderingView from './components/OrderingView';
import PaymentView from './components/PaymentView';
import Header from './components/common/Header';
import LoginView from './components/LoginView';
import MobileDashboardView from './components/MobileDashboardView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Map<string, Ticket>>(new Map());
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('ORDERING');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme as 'light' | 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
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
    return Array.from(tickets.values()).filter(t => t.status === 'paid');
  }, [tickets]);

  const startNewOrder = useCallback(() => {
    const newTicketId = `T-${Date.now()}`;
    const newTicket: Ticket = {
      id: newTicketId,
      tableId: 'counter', // Use a generic ID since there are no tables
      items: [],
      total: 0,
      subtotal: 0,
      tax: 0,
      status: 'open',
    };
    setTickets(prevTickets => new Map(prevTickets).set(newTicketId, newTicket));
    setActiveTicketId(newTicketId);
    setCurrentView('ORDERING');
  }, []);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    if (user.role === 'director') {
      setCurrentView('MOBILE_DASHBOARD');
    } else {
      startNewOrder();
    }
  }, [startNewOrder]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setActiveTicketId(null);
  }, []);
  
  const updateTicketTotals = (items: TicketItem[]): { subtotal: number, tax: number, total: number } => {
    const subtotal = items.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
    const tax = subtotal * 0.16; // 16% VAT
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleAddItemToTicket = useCallback((item: MenuItem) => {
    if (!activeTicketId) return;

    setTickets(prevTickets => {
      const newTickets = new Map<string, Ticket>(prevTickets);
      const ticket = newTickets.get(activeTicketId);
      if (!ticket) return prevTickets;

      const existingItem = ticket.items.find(ticketItem => ticketItem.menuItem.id === item.id);
      let newItems: TicketItem[];

      if (existingItem) {
        newItems = ticket.items.map(ticketItem =>
          ticketItem.menuItem.id === item.id
            ? { ...ticketItem, quantity: ticketItem.quantity + 1 }
            : ticketItem
        );
      } else {
        newItems = [...ticket.items, { menuItem: item, quantity: 1 }];
      }
      
      const { subtotal, tax, total } = updateTicketTotals(newItems);
      const updatedTicket: Ticket = { ...ticket, items: newItems, subtotal, tax, total };
      newTickets.set(activeTicketId, updatedTicket);
      return newTickets;
    });
  }, [activeTicketId]);

  const handleUpdateItemQuantity = useCallback((itemId: string, quantity: number) => {
    if (!activeTicketId) return;

    setTickets(prevTickets => {
      const newTickets = new Map<string, Ticket>(prevTickets);
      const ticket = newTickets.get(activeTicketId);
      if (!ticket) return prevTickets;

      let newItems: TicketItem[];
      if (quantity <= 0) {
        newItems = ticket.items.filter(item => item.menuItem.id !== itemId);
      } else {
        newItems = ticket.items.map(item =>
          item.menuItem.id === itemId ? { ...item, quantity } : item
        );
      }

      const { subtotal, tax, total } = updateTicketTotals(newItems);
      const updatedTicket: Ticket = { ...ticket, items: newItems, subtotal, tax, total };
      newTickets.set(activeTicketId, updatedTicket);
      return newTickets;
    });
  }, [activeTicketId]);
  
  const handleGoToPayment = useCallback(() => {
    if (currentUser?.role !== 'cashier') {
      alert("You do not have permission to process payments.");
      return;
    }
    if (activeTicket && activeTicket.items.length > 0) {
      setCurrentView('PAYMENT');
    } else {
      alert("Cannot proceed to payment with an empty ticket.");
    }
  }, [activeTicket, currentUser]);

  const handleProcessPayment = useCallback(() => {
    if (!activeTicket) return;

    setTickets(prevTickets => {
      const newTickets = new Map<string, Ticket>(prevTickets);
      const ticket = newTickets.get(activeTicket.id);
      if (ticket) {
        const updatedTicket = { ...ticket, status: 'paid' as const };
        newTickets.set(activeTicket.id, updatedTicket);
      }
      return newTickets;
    });

    startNewOrder();
  }, [activeTicket, startNewOrder]);

  const handleCancelOrder = useCallback(() => {
    if (activeTicket && activeTicket.items.length > 0) {
        if (window.confirm('Are you sure you want to cancel this order and start a new one?')) {
            startNewOrder();
        }
    } else {
        startNewOrder();
    }
  }, [activeTicket, startNewOrder]);

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderContent = () => {
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
      case 'MOBILE_DASHBOARD':
        return <MobileDashboardView paidTickets={paidTickets} onLogout={handleLogout} />;
      default:
        return null;
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-surface-main dark:bg-surface-dark text-text-main dark:text-text-dark-main overflow-hidden">
      {currentUser.role !== 'director' && (
        <Header 
          userRole={currentUser.role}
          onLogout={handleLogout} 
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;