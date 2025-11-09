import React, { useState, useCallback } from 'react';
import type { Ticket } from '../types';
import { getUpsellSuggestions } from '../services/geminiService';
import { PlusIcon, MinusIcon, SparklesIcon, XMarkIcon } from './common/icons';

interface TicketViewProps {
  ticket: Ticket;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onGoToPayment: () => void;
  onClose: () => void;
}

const TicketView: React.FC<TicketViewProps> = ({ ticket, onUpdateQuantity, onGoToPayment, onClose }) => {
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  const handleAiSuggest = useCallback(async () => {
    if (!ticket || ticket.items.length === 0) {
      setAiSuggestion("Add items to the order to get suggestions.");
      return;
    }
    setIsLoadingSuggestion(true);
    setAiSuggestion(null);
    try {
      const suggestion = await getUpsellSuggestions(ticket.items);
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      setAiSuggestion("Sorry, I couldn't get a suggestion right now.");
    } finally {
      setIsLoadingSuggestion(false);
    }
  }, [ticket]);

  return (
    <div className="flex flex-col h-full bg-surface-card dark:bg-surface-dark-card text-text-main dark:text-text-dark-main">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ticket #{ticket.id.slice(-4)}</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {ticket.items.length === 0 ? (
          <p className="text-center text-text-secondary dark:text-text-dark-secondary mt-8">No items added yet.</p>
        ) : (
          ticket.items.map(({ menuItem, quantity }) => (
            <div key={menuItem.id} className="flex items-center">
              <div className="flex-1">
                <p className="font-semibold">{menuItem.name}</p>
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary">Ksh {menuItem.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onUpdateQuantity(menuItem.id, quantity - 1)} className="p-1 bg-gray-200 dark:bg-gray-600 rounded-full"><MinusIcon className="h-4 w-4" /></button>
                <span className="w-6 text-center font-semibold">{quantity}</span>
                <button onClick={() => onUpdateQuantity(menuItem.id, quantity + 1)} className="p-1 bg-gray-200 dark:bg-gray-600 rounded-full"><PlusIcon className="h-4 w-4" /></button>
              </div>
              <div className="w-24 text-right font-semibold">Ksh {(menuItem.price * quantity).toFixed(2)}</div>
            </div>
          ))
        )}
      </div>

      {/* AI Suggestion Box */}
      <div className="p-4 border-t border-b border-gray-200 dark:border-gray-700">
        <button onClick={handleAiSuggest} disabled={isLoadingSuggestion} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400 transition-colors">
          <SparklesIcon className="h-5 w-5" />
          {isLoadingSuggestion ? 'Thinking...' : 'AI Upsell Suggestion'}
        </button>
        {aiSuggestion && (
          <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800 rounded-md text-sm text-purple-800 dark:text-purple-200">
            {aiSuggestion}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between"><span>Subtotal</span><span>Ksh {ticket.subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Tax (16%)</span><span>Ksh {ticket.tax.toFixed(2)}</span></div>
        <div className="flex justify-between font-bold text-xl"><span>Total</span><span>Ksh {ticket.total.toFixed(2)}</span></div>
      </div>
      
      {/* Action Button - Hidden on mobile */}
      <div className="p-4 hidden md:block">
        <button
          onClick={onGoToPayment}
          disabled={ticket.items.length === 0}
          className="w-full bg-brand-primary text-white font-bold py-4 rounded-lg text-xl hover:bg-brand-secondary transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
        >
          PAY
        </button>
      </div>
    </div>
  );
};

export default TicketView;