import React, { useState } from 'react';
import type { Ticket } from '../types';
import { ArrowLeftIcon, CreditCardIcon, BanknotesIcon } from './common/icons';

interface PaymentViewProps {
  ticket: Ticket;
  onProcessPayment: (paymentMethod: 'cash' | 'card') => void;
  onBack: () => void;
}

const PaymentView: React.FC<PaymentViewProps> = ({ ticket, onProcessPayment, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | null>(null);

  const handleConfirm = () => {
    if (paymentMethod) {
        onProcessPayment(paymentMethod);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-surface-card dark:bg-surface-dark-card rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 relative">
          <button onClick={onBack} className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h2 className="text-3xl font-bold text-center">Payment</h2>
        </div>

        <div className="p-8 text-center">
          <p className="text-lg text-text-secondary dark:text-text-dark-secondary">Total Amount Due</p>
          <p className="text-6xl font-bold my-4 text-brand-primary dark:text-brand-light">Ksh {ticket.total.toFixed(2)}</p>
        </div>

        <div className="px-8 pb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-6 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-colors ${paymentMethod === 'cash' ? 'bg-brand-light text-white border-brand-primary' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-transparent'}`}
                >
                    <BanknotesIcon className="h-10 w-10"/>
                    <span className="font-semibold">Cash</span>
                </button>
                <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-6 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-colors ${paymentMethod === 'card' ? 'bg-brand-light text-white border-brand-primary' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-transparent'}`}
                >
                    <CreditCardIcon className="h-10 w-10"/>
                    <span className="font-semibold">Card</span>
                </button>
            </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
          <button
            onClick={handleConfirm}
            disabled={!paymentMethod}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg text-xl hover:bg-green-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;