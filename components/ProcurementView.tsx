import React, { useState, useMemo } from 'react';
import type { StockItem } from '../types';
import { PowerIcon, PlusIcon, EnvelopeIcon } from './common/icons';
import { LOW_STOCK_THRESHOLD } from '../constants';

interface ProcurementViewProps {
    stockItems: StockItem[];
    onUpdateStock: (stockItemId: string, newQuantity: number) => void;
    onAddStockItem: (newItem: Omit<StockItem, 'id'>) => void;
    onLogout: () => void;
}

const ProcurementView: React.FC<ProcurementViewProps> = ({ stockItems, onUpdateStock, onAddStockItem, onLogout }) => {
    const [updatedQuantities, setUpdatedQuantities] = useState<Record<string, string>>({});
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');
    const [newItemUnit, setNewItemUnit] = useState<'pcs' | 'g' | 'ml'>('pcs');

    const lowStockItems = useMemo(() => 
        stockItems.filter(item => item.quantity < LOW_STOCK_THRESHOLD)
        .sort((a,b) => a.quantity - b.quantity),
    [stockItems]);

    const handleQuantityChange = (id: string, value: string) => {
        setUpdatedQuantities(prev => ({ ...prev, [id]: value }));
    };

    const handleUpdateClick = (id: string) => {
        const newQuantity = parseInt(updatedQuantities[id], 10);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            onUpdateStock(id, newQuantity);
            setUpdatedQuantities(prev => {
                const newRecord = { ...prev };
                delete newRecord[id];
                return newRecord;
            });
        } else {
            alert("Please enter a valid non-negative number.");
        }
    };
    
    const handleAddNewItem = (e: React.FormEvent) => {
        e.preventDefault();
        const quantity = parseInt(newItemQuantity, 10);
        if (newItemName.trim() && !isNaN(quantity) && quantity >= 0) {
            onAddStockItem({ name: newItemName.trim(), quantity, unit: newItemUnit });
            setNewItemName('');
            setNewItemQuantity('');
            setNewItemUnit('pcs');
        } else {
            alert("Please fill all fields with valid values.");
        }
    };

    const handleNotifySupplier = (item: StockItem) => {
        const subject = `Urgent: Reorder Request for ${item.name}`;
        const body = `Hello Supplier,\n\nThis is a reorder request for the following item:\n\nItem: ${item.name}\nCurrent Quantity: ${item.quantity} ${item.unit}\n\nPlease process a new shipment. Let us know the estimated delivery date.\n\nThank you,\nProcurement Team`;
        window.location.href = `mailto:supplier@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="h-full w-full bg-surface-dark text-text-dark-main flex flex-col">
            <header className="flex-shrink-0 bg-surface-dark-card/50 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-xl font-bold">Procurement Dashboard</h1>
                <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                    <PowerIcon className="h-5 w-5" />
                    <span className="font-semibold">Logout</span>
                </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Low Stock Alerts */}
                {lowStockItems.length > 0 && (
                    <div className="bg-red-900/40 border border-red-700 rounded-xl">
                        <h2 className="text-lg font-bold text-red-200 p-4 border-b border-red-700">Low Stock Alerts ({lowStockItems.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-red-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-red-200 uppercase tracking-wider">Item Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-red-200 uppercase tracking-wider">Current Qty</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-red-200 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockItems.map(item => (
                                        <tr key={item.id} className="border-t border-red-800">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-300">{item.quantity} {item.unit}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleNotifySupplier(item)}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600 text-white text-xs font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
                                                    title="Email supplier for reorder"
                                                >
                                                    <EnvelopeIcon className="h-4 w-4" />
                                                    Notify Supplier
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Add New Item Form */}
                <div className="bg-surface-dark-card rounded-xl p-4">
                    <h2 className="text-lg font-bold text-text-dark-main mb-4">Add New Stock Item</h2>
                    <form onSubmit={handleAddNewItem} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                        <div className="sm:col-span-2">
                            <label htmlFor="itemName" className="block text-sm font-medium text-text-dark-secondary">Item Name</label>
                            <input type="text" id="itemName" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light text-white" required />
                        </div>
                        <div>
                            <label htmlFor="itemQty" className="block text-sm font-medium text-text-dark-secondary">Quantity</label>
                            <input type="number" id="itemQty" value={newItemQuantity} onChange={e => setNewItemQuantity(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light text-white" min="0" required />
                        </div>
                         <div>
                            <label htmlFor="itemUnit" className="block text-sm font-medium text-text-dark-secondary">Unit</label>
                            <select id="itemUnit" value={newItemUnit} onChange={e => setNewItemUnit(e.target.value as any)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light text-white">
                                <option>pcs</option>
                                <option>g</option>
                                <option>ml</option>
                            </select>
                        </div>
                        <button type="submit" className="sm:col-start-4 sm:w-auto w-full flex justify-center items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                           <PlusIcon className="h-5 w-5" /> Add Item
                        </button>
                    </form>
                </div>

                {/* Stock List */}
                <div className="bg-surface-dark-card rounded-xl">
                    <h2 className="text-lg font-bold text-text-dark-main p-4 border-b border-gray-700">Current Inventory</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Item Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Current Qty</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">New Qty</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {stockItems.map(item => (
                                    <tr key={item.id} className={item.quantity < LOW_STOCK_THRESHOLD ? 'bg-red-900/30' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.quantity} {item.unit}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                value={updatedQuantities[item.id] || ''}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                className="w-24 bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light text-white"
                                                placeholder="Set new qty"
                                                min="0"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleUpdateClick(item.id)}
                                                disabled={!updatedQuantities[item.id]}
                                                className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors disabled:bg-gray-600"
                                            >
                                                Update
                                            </button>
                                        </td>
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

export default ProcurementView;