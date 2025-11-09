
import React, { useState, useCallback, useMemo } from 'react';
import type { Table, Ticket, MenuItem, ViewType, TicketItem } from './types';
import { TABLES_DATA } from './constants';
import TableView from './components/TableView';
import OrderingView from './components/OrderingView';
import PaymentView from './components/PaymentView';
import Header from './components/common/Header';
import LoginView from './components/LoginView';
import MobileDashboardView from './components/MobileDashboardView';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [tables, setTables] = useState<Table[]>(TABLES_DATA);
  const [tickets, setTickets] = useState<Map<string, Ticket>>(new Map());
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('TABLES');

  const activeTicket = useMemo(() => {
    if (!activeTicketId) return null;
    return tickets.get(activeTicketId) || null;
  }, [activeTicketId, tickets]);

  const paidTickets = useMemo(() => {
    return Array.from(tickets.values()).filter(t => t.status === 'paid');
  }, [tickets]);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setActiveTicketId(null);
    setCurrentView('TABLES');
    // Optionally reset tables and tickets to initial state
    // setTables(TABLES_DATA);
    // setTickets(new Map());
  }, []);

  const handleSelectTable = useCallback((tableId: string) => {
    // FIX: Removed explicit type on `ticket` parameter to rely on type inference, which resolves the issue of `existingTicket` being typed as `unknown`.
    const existingTicket = Array.from(tickets.values()).find(
      (ticket) => ticket.tableId === tableId && ticket.status === 'open'
    );

    if (existingTicket) {
      setActiveTicketId(existingTicket.id);
    } else {
      const newTicketId = `T-${Date.now()}`;
      const newTicket: Ticket = {
        id: newTicketId,
        tableId,
        items: [],
        total: 0,
        subtotal: 0,
        tax: 0,
        status: 'open',
      };
      setTickets(prevTickets => new Map(prevTickets).set(newTicketId, newTicket));
      setTables(prevTables =>
        prevTables.map(table =>
          table.id === tableId ? { ...table, status: 'occupied' } : table
        )
      );
      setActiveTicketId(newTicketId);
    }
    setCurrentView('ORDERING');
  }, [tickets]);

  const updateTicketTotals = (items: TicketItem[]): { subtotal: number, tax: number, total: number } => {
    const subtotal = items.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleAddItemToTicket = useCallback((item: MenuItem) => {
    if (!activeTicketId) return;

    setTickets(prevTickets => {
      // FIX: Explicitly type the new Map to ensure correct type inference for 'ticket'.
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
      // FIX: Explicitly type the new Map to ensure correct type inference for 'ticket'.
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
    if (activeTicket && activeTicket.items.length > 0) {
      setCurrentView('PAYMENT');
    } else {
      alert("Cannot proceed to payment with an empty ticket.");
    }
  }, [activeTicket]);

  const handleProcessPayment = useCallback(() => {
    if (!activeTicket) return;

    setTickets(prevTickets => {
      // FIX: Explicitly type the new Map to ensure correct type inference for 'ticket'.
      const newTickets = new Map<string, Ticket>(prevTickets);
      const ticket = newTickets.get(activeTicket.id);
      if (ticket) {
        const updatedTicket = { ...ticket, status: 'paid' as const };
        newTickets.set(activeTicket.id, updatedTicket);
      }
      return newTickets;
    });

    setTables(prevTables =>
      prevTables.map(table =>
        table.id === activeTicket.tableId ? { ...table, status: 'available' } : table
      )
    );

    setActiveTicketId(null);
    setCurrentView('TABLES');
  }, [activeTicket]);

  const handleCloseOrderView = useCallback(() => {
    setActiveTicketId(null);
    setCurrentView('TABLES');
  }, []);
  
  const handleGoToMobileDashboard = useCallback(() => {
    setCurrentView('MOBILE_DASHBOARD');
  }, []);

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch(currentView) {
      case 'TABLES':
        return <TableView tables={tables} onSelectTable={handleSelectTable} />;
      case 'ORDERING':
        return activeTicket && (
          <OrderingView
            ticket={activeTicket}
            onAddItem={handleAddItemToTicket}
            onUpdateQuantity={handleUpdateItemQuantity}
            onGoToPayment={handleGoToPayment}
            onClose={handleCloseOrderView}
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
        return <MobileDashboardView paidTickets={paidTickets} onBackToPOS={handleCloseOrderView} />;
      default:
        return <TableView tables={tables} onSelectTable={handleSelectTable} />;
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-surface-main dark:bg-surface-dark text-text-main dark:text-text-dark-main overflow-hidden">
      {currentView !== 'MOBILE_DASHBOARD' && (
        <Header 
          currentView={currentView} 
          onHomeClick={handleCloseOrderView} 
          onLogout={handleLogout} 
          onMobileDashboardClick={handleGoToMobileDashboard}
        />
      )}
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
