import React, { useMemo } from 'react';
import type { Ticket, StockItem } from '../types';
import { PowerIcon } from './common/icons';
import { STOCK_ITEMS } from '../constants'; // To get names for stock items

interface AccountantViewProps {
    paidTickets: Ticket[];
    onLogout: () => void;
}

const AccountantView: React.FC<AccountantViewProps> = ({ paidTickets, onLogout }) => {
    
    const reportData = useMemo(() => {
        const totalRevenue = paidTickets.reduce((sum, ticket) => sum + ticket.total, 0);
        const totalTax = paidTickets.reduce((sum, ticket) => sum + ticket.tax, 0);

        const stockUsage = new Map<string, { name: string, unit: StockItem['unit'], quantity: number }>();

        paidTickets.forEach(ticket => {
            ticket.items.forEach(item => {
                item.menuItem.recipe.forEach(ingredient => {
                    const stockItemInfo = STOCK_ITEMS.find(si => si.id === ingredient.stockItemId);
                    if (stockItemInfo) {
                        const existing = stockUsage.get(ingredient.stockItemId) || { name: stockItemInfo.name, unit: stockItemInfo.unit, quantity: 0 };
                        existing.quantity += ingredient.quantity * item.quantity;
                        stockUsage.set(ingredient.stockItemId, existing);
                    }
                });
            });
        });
        
        const sortedStockUsage = [...stockUsage.values()].sort((a,b) => b.quantity - a.quantity);

        return {
            totalRevenue,
            totalTax,
            stockUsage: sortedStockUsage,
        };
    }, [paidTickets]);

    return (
        <div className="h-full w-full bg-surface-dark text-text-dark-main flex flex-col">
            <header className="flex-shrink-0 bg-surface-dark-card/50 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-xl font-bold">Accountant Dashboard</h1>
                <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                    <PowerIcon className="h-5 w-5" />
                    <span className="font-semibold">Logout</span>
                </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Financial Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-surface-dark-card rounded-xl p-4">
                        <p className="text-sm text-text-dark-secondary">Total Revenue</p>
                        <p className="text-3xl font-bold text-green-400">Ksh {reportData.totalRevenue.toFixed(2)}</p>
                    </div>
                     <div className="bg-surface-dark-card rounded-xl p-4">
                        <p className="text-sm text-text-dark-secondary">Total Tax Collected (16%)</p>
                        <p className="text-3xl font-bold text-orange-400">Ksh {reportData.totalTax.toFixed(2)}</p>
                    </div>
                </div>

                {/* Stock Usage Report */}
                <div className="bg-surface-dark-card rounded-xl">
                    <h2 className="text-lg font-bold text-text-dark-main p-4 border-b border-gray-700">Stock Usage Report (from sales)</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ingredient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity Used</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {reportData.stockUsage.map(item => (
                                    <tr key={item.name}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.quantity.toLocaleString()} {item.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountantView;
