import React from 'react';
import type { Ticket } from '../types';
import { printTicket } from '../utils/printTicket';
import { printEtimmsReceipt } from '../utils/printEtimmsReceipt';
import { PrinterIcon, QrCodeIcon } from './common/icons';

interface ReceiptViewProps {
  ticket: Ticket;
  onDone: () => void;
}

const ReceiptView: React.FC<ReceiptViewProps> = ({ ticket, onDone }) => {
  const handlePrintStandard = () => {
    printTicket(ticket, true);
  };

  const handlePrintEtimms = () => {
    printEtimmsReceipt(ticket);
  };

  return (
    <div className="h-full flex items-center justify-center bg-surface-main dark:bg-surface-dark">
      <div className="w-full max-w-lg p-8 bg-surface-card dark:bg-surface-dark-card rounded-xl shadow-2xl text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="mt-4 text-3xl font-bold text-text-main dark:text-text-dark-main">Payment Successful!</h2>
        <p className="mt-2 text-text-secondary dark:text-text-dark-secondary">
          Total amount of <strong>Ksh {ticket.total.toFixed(2)}</strong> paid via {ticket.paymentMethod}.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          <button
            onClick={handlePrintStandard}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-600 text-text-main dark:text-text-dark-main font-bold rounded-lg text-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            <PrinterIcon className="h-6 w-6" />
            Print Receipt
          </button>
           <button
            onClick={handlePrintEtimms}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-600 text-text-main dark:text-text-dark-main font-bold rounded-lg text-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            <QrCodeIcon className="h-6 w-6" />
            Print ETIMMS
          </button>
          <button
            onClick={onDone}
            className="w-full sm:w-auto px-8 py-3 bg-brand-primary text-white font-bold rounded-lg text-lg hover:bg-brand-secondary transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptView;