import React from 'react';
import type { Ticket } from '../types';
import { PowerIcon, PrinterIcon, QrCodeIcon } from './common/icons';
import { printTicket } from '../utils/printTicket';
import { printEtimmsReceipt } from '../utils/printEtimmsReceipt';

interface CashierDashboardViewProps {
    paidTickets: Ticket[];
    onLogout: () => void;
    onStartNewOrder: () => void;
}

const CashierDashboardView: React.FC<CashierDashboardViewProps> = ({ paidTickets, onLogout, onStartNewOrder }) => {
    
    return (
        <div className="h-full w-full bg-surface-dark text-text-dark-main flex flex-col">
            <header className="flex-shrink-0 bg-surface-dark-card/50 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-xl font-bold">Cashier Dashboard</h1>
                <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                    <PowerIcon className="h-5 w-5" />
                    <span className="font-semibold hidden sm:inline">Logout</span>
                </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* Actions */}
                <div className="bg-surface-dark-card rounded-xl p-4">
                     <button 
                        onClick={onStartNewOrder}
                        className="w-full bg-green-600 text-white font-bold py-4 rounded-lg text-xl hover:bg-green-700 transition-colors"
                    >
                        Start New Order
                    </button>
                </div>
                
                {/* Recent Transactions */}
                <div className="bg-surface-dark-card rounded-xl">
                    <h2 className="text-lg font-bold text-text-dark-main p-4 border-b border-gray-700">Recent Transactions</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ticket ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {paidTickets.map(ticket => (
                                    <tr key={ticket.id}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-white">#{ticket.id.slice(-6)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{new Date(ticket.paidAt!).toLocaleString()}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-400">Ksh {ticket.total.toFixed(2)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                                            <button 
                                                onClick={() => printTicket(ticket, true)} 
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 text-white text-xs font-semibold rounded-lg hover:bg-gray-500 transition-colors"
                                                title="Print Standard Receipt"
                                            >
                                                <PrinterIcon className="h-4 w-4" />
                                                <span>Std</span>
                                            </button>
                                            <button 
                                                onClick={() => printEtimmsReceipt(ticket)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors"
                                                title="Print ETIMMS Receipt"
                                            >
                                                <QrCodeIcon className="h-4 w-4" />
                                                <span>ETIMMS</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {paidTickets.length === 0 && (
                            <p className="text-center py-8 text-gray-400">No paid transactions yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashierDashboardView;