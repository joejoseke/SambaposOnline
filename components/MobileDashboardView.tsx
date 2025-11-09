import React, { useMemo } from 'react';
import type { Ticket } from '../types';
import { ArrowLeftIcon, ChartBarIcon, CurrencyDollarIcon, ShoppingCartIcon } from './common/icons';

interface MobileDashboardViewProps {
    paidTickets: Ticket[];
    onBackToPOS: () => void;
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

const ReportCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface-dark-card rounded-xl p-4">
        <h2 className="text-lg font-bold text-text-dark-main mb-4">{title}</h2>
        {children}
    </div>
);

const MobileDashboardView: React.FC<MobileDashboardViewProps> = ({ paidTickets, onBackToPOS }) => {

    const reportData = useMemo(() => {
        const totalRevenue = paidTickets.reduce((sum, ticket) => sum + ticket.total, 0);
        const totalSales = paidTickets.length;
        const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

        const salesByItem = new Map<string, { name: string, quantity: number, revenue: number }>();
        paidTickets.forEach(ticket => {
            ticket.items.forEach(item => {
                const existing = salesByItem.get(item.menuItem.id) || { name: item.menuItem.name, quantity: 0, revenue: 0 };
                existing.quantity += item.quantity;
                existing.revenue += item.quantity * item.menuItem.price;
                salesByItem.set(item.menuItem.id, existing);
            });
        });

        const topSellingItems = [...salesByItem.values()]
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        const salesByCategory = new Map<string, number>();
         paidTickets.forEach(ticket => {
            ticket.items.forEach(item => {
                const existing = salesByCategory.get(item.menuItem.category) || 0;
                salesByCategory.set(item.menuItem.category, existing + (item.quantity * item.menuItem.price));
            });
        });
        
        const sortedSalesByCategory = [...salesByCategory.entries()]
            .sort((a,b) => b[1] - a[1]);

        const recentTransactions = paidTickets.slice(-5).reverse();

        return {
            totalRevenue,
            totalSales,
            averageSale,
            topSellingItems,
            salesByCategory: sortedSalesByCategory,
            recentTransactions
        };
    }, [paidTickets]);
    
    const maxCategoryValue = reportData.salesByCategory[0]?.[1] || 1;

    return (
        <div className="h-full w-full bg-surface-dark text-text-dark-main flex flex-col">
            {/* Header */}
            <header className="flex-shrink-0 bg-surface-dark-card/50 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-10">
                <button onClick={onBackToPOS} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-bold">Mobile Report</h1>
                <div className="w-8"></div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <KpiCard title="Total Revenue" value={`Ksh ${reportData.totalRevenue.toFixed(2)}`} icon={<CurrencyDollarIcon className="h-6 w-6 text-green-400" />} />
                    <KpiCard title="Total Sales" value={reportData.totalSales.toString()} icon={<ShoppingCartIcon className="h-6 w-6 text-blue-400" />} />
                    <KpiCard title="Average Sale" value={`Ksh ${reportData.averageSale.toFixed(2)}`} icon={<ChartBarIcon className="h-6 w-6 text-purple-400" />} />
                </div>

                {/* Sales By Category */}
                <ReportCard title="Sales By Category">
                    <div className="space-y-3">
                        {reportData.salesByCategory.map(([category, value]) => (
                            <div key={category}>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="font-semibold">{category}</span>
                                    <span>Ksh {value.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-brand-light h-2.5 rounded-full" style={{ width: `${(value / maxCategoryValue) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ReportCard>

                {/* Top Selling Items */}
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

                {/* Recent Transactions */}
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

export default MobileDashboardView;