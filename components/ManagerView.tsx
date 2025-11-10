import React, { useMemo } from 'react';
import type { Ticket, StockItem } from '../types';
import { PowerIcon, ChartBarIcon, CurrencyDollarIcon, ShoppingCartIcon, EnvelopeIcon } from './common/icons';
import { LOW_STOCK_THRESHOLD } from '../constants';

interface ManagerViewProps {
    paidTickets: Ticket[];
    stockItems: StockItem[];
    onLogout: () => void;
}

const KpiCard: React.FC<{ title: string, value: string, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-surface-dark-card rounded-xl p-4 flex items-center">
        <div className="p-3 mr-4 bg-white/10 rounded-lg">{icon}</div>
        <div>
            <p className="text-sm text-text-dark-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-dark-main">{value}</p>
        </div>
    </div>
);

const ManagerView: React.FC<ManagerViewProps> = ({ paidTickets, stockItems, onLogout }) => {

    const reportData = useMemo(() => {
        const totalRevenue = paidTickets.reduce((sum, ticket) => sum + ticket.total, 0);
        const totalSales = paidTickets.length;
        const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;
        return { totalRevenue, totalSales, averageSale };
    }, [paidTickets]);

    const handleNotifySupplier = (item: StockItem) => {
        const subject = `Urgent: Low Stock Alert for ${item.name}`;
        const body = `Hello Procurement Team,\n\nThis is an automated notification to inform you that the stock for the item "${item.name}" is running low.\n\nCurrent Quantity: ${item.quantity} ${item.unit}\nThreshold: ${LOW_STOCK_THRESHOLD} ${item.unit}\n\nPlease initiate the reordering process at your earliest convenience.\n\nThank you,\nNeon POS System`;
        window.location.href = `mailto:procurement@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="h-full w-full bg-surface-dark text-text-dark-main flex flex-col">
            <header className="flex-shrink-0 bg-surface-dark-card/50 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-xl font-bold">Manager Dashboard</h1>
                <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                    <PowerIcon className="h-5 w-5" />
                    <span className="font-semibold">Logout</span>
                </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <KpiCard title="Total Revenue" value={`Ksh ${reportData.totalRevenue.toFixed(2)}`} icon={<CurrencyDollarIcon className="h-6 w-6 text-green-400" />} />
                    <KpiCard title="Total Sales" value={reportData.totalSales.toString()} icon={<ShoppingCartIcon className="h-6 w-6 text-blue-400" />} />
                    <KpiCard title="Average Sale" value={`Ksh ${reportData.averageSale.toFixed(2)}`} icon={<ChartBarIcon className="h-6 w-6 text-purple-400" />} />
                </div>

                {/* Live Stock Levels */}
                <div className="bg-surface-dark-card rounded-xl">
                    <h2 className="text-lg font-bold text-text-dark-main p-4 border-b border-gray-700">Live Stock Levels</h2>
                    <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Item Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Current Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {stockItems.map(item => {
                                    const isLowStock = item.quantity < LOW_STOCK_THRESHOLD;
                                    return (
                                    <tr key={item.id} className={isLowStock ? 'bg-red-900/50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.quantity} {item.unit}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {isLowStock ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800">
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-200 text-green-800">
                                                    OK
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {isLowStock && (
                                                <button
                                                    onClick={() => handleNotifySupplier(item)}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600 text-white text-xs font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
                                                    title="Notify Procurement"
                                                >
                                                    <EnvelopeIcon className="h-4 w-4" />
                                                    Notify
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerView;