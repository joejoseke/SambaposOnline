import React, { useMemo } from 'react';
import type { Ticket, User } from '../types';
import { USERS } from '../constants';
import { PowerIcon, ChartBarIcon, CurrencyDollarIcon, ShoppingCartIcon, UserGroupIcon } from './common/icons';

interface DirectorDashboardViewProps {
    paidTickets: Ticket[];
    onLogout: () => void;
}

interface KpiCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon }) => (
    <div className="bg-surface-dark-card rounded-xl p-4 flex items-center">
        <div className="p-3 mr-4 bg-white/10 rounded-lg">{icon}</div>
        <div>
            <p className="text-sm text-text-dark-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-dark-main">{value}</p>
        </div>
    </div>
);

const ReportCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-surface-dark-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
            {icon}
            <h2 className="text-lg font-bold text-text-dark-main">{title}</h2>
        </div>
        {children}
    </div>
);

const DirectorDashboardView: React.FC<DirectorDashboardViewProps> = ({ paidTickets, onLogout }) => {

    const reportData = useMemo(() => {
        const totalRevenue = paidTickets.reduce((sum, ticket) => sum + ticket.total, 0);
        const totalSales = paidTickets.length;
        const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

        const salesByItem = new Map<string, { name: string, quantity: number, revenue: number }>();
        const salesByCategory = new Map<string, number>();
        const salesByStaff = new Map<string, number>();

        const staffMap = new Map<string, User>(USERS.map(u => [u.id, u]));

        paidTickets.forEach(ticket => {
            ticket.items.forEach(item => {
                const existingItem = salesByItem.get(item.menuItem.id) || { name: item.menuItem.name, quantity: 0, revenue: 0 };
                existingItem.quantity += item.quantity;
                existingItem.revenue += item.quantity * item.menuItem.price;
                salesByItem.set(item.menuItem.id, existingItem);

                const existingCategory = salesByCategory.get(item.menuItem.category) || 0;
                salesByCategory.set(item.menuItem.category, existingCategory + (item.quantity * item.menuItem.price));
            });

            if (ticket.userId && (staffMap.get(ticket.userId)?.role === 'waiter' || staffMap.get(ticket.userId)?.role === 'cashier')) {
                const existingStaffSales = salesByStaff.get(ticket.userId) || 0;
                salesByStaff.set(ticket.userId, existingStaffSales + ticket.total);
            }
        });

        const topSellingItems = [...salesByItem.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
        const sortedSalesByCategory = [...salesByCategory.entries()].sort((a, b) => b[1] - a[1]);
        const sortedSalesByStaff = [...salesByStaff.entries()]
            .map(([userId, total]) => ({ user: staffMap.get(userId)!, total }))
            .filter(item => item.user) // Ensure user exists
            .sort((a, b) => b.total - a.total);
            
        const recentTransactions = paidTickets.slice(-5).reverse();

        return {
            totalRevenue,
            totalSales,
            averageSale,
            topSellingItems,
            salesByCategory: sortedSalesByCategory,
            salesByStaff: sortedSalesByStaff,
            recentTransactions
        };
    }, [paidTickets]);
    
    const maxCategoryValue = reportData.salesByCategory[0]?.[1] || 1;
    const maxStaffSaleValue = reportData.salesByStaff[0]?.total || 1;

    return (
        <div className="h-full w-full bg-surface-dark text-text-dark-main flex flex-col">
            <header className="flex-shrink-0 bg-surface-dark-card/50 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-xl font-bold">Director Dashboard</h1>
                 <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                    <PowerIcon className="h-5 w-5" />
                    <span className="font-semibold">Logout</span>
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <KpiCard title="Total Revenue" value={`Ksh ${reportData.totalRevenue.toFixed(2)}`} icon={<CurrencyDollarIcon className="h-6 w-6 text-green-400" />} />
                    <KpiCard title="Total Sales" value={reportData.totalSales.toString()} icon={<ShoppingCartIcon className="h-6 w-6 text-blue-400" />} />
                    <KpiCard title="Average Sale" value={`Ksh ${reportData.averageSale.toFixed(2)}`} icon={<ChartBarIcon className="h-6 w-6 text-purple-400" />} />
                </div>

                <ReportCard title="Sales Performance by Staff" icon={<UserGroupIcon className="h-6 w-6 text-teal-400" />}>
                    <div className="space-y-3">
                        {reportData.salesByStaff.map(({ user, total }) => (
                            <div key={user.id}>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="font-semibold capitalize">{user.role} (ID: {user.id})</span>
                                    <span className="font-bold">Ksh {total.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${(total / maxStaffSaleValue) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                         {reportData.salesByStaff.length === 0 && <p className="text-sm text-gray-400">No sales recorded for staff members yet.</p>}
                    </div>
                </ReportCard>

                <ReportCard title="Sales By Category" icon={<ChartBarIcon className="h-6 w-6 text-indigo-400" />}>
                    <div className="space-y-3">
                        {reportData.salesByCategory.map(([category, value]) => (
                            <div key={category}>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="font-semibold">{category}</span>
                                    <span>Ksh {value.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${(value / maxCategoryValue) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ReportCard>

                <ReportCard title="Top 5 Selling Items">
                    <ul className="divide-y divide-gray-700">
                        {reportData.topSellingItems.map(item => (
                            <li key={item.name} className="flex justify-between items-center py-2">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-text-dark-secondary">Ksh {item.revenue.toFixed(2)} revenue</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{item.quantity} sold</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </ReportCard>

                <ReportCard title="Recent Transactions">
                     <ul className="divide-y divide-gray-700">
                        {reportData.recentTransactions.map(ticket => (
                            <li key={ticket.id} className="flex justify-between items-center py-2">
                                <div>
                                    <p className="font-semibold">Ticket #{ticket.id.slice(-4)}</p>
                                    <p className="text-sm text-text-dark-secondary">{ticket.items.length} items</p>
                                </div>
                                <div className="font-bold text-lg text-green-400">Ksh {ticket.total.toFixed(2)}</div>
                            </li>
                        ))}
                    </ul>
                </ReportCard>
            </div>
        </div>
    );
};

export default DirectorDashboardView;