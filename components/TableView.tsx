
import React from 'react';
import type { Table } from '../types';
import { TableIcon, UserGroupIcon } from './common/icons';

interface TableViewProps {
  tables: Table[];
  onSelectTable: (tableId: string) => void;
}

const TableCard: React.FC<{ table: Table; onSelect: () => void }> = ({ table, onSelect }) => {
  const statusClasses = {
    available: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800',
    occupied: 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800',
  };

  return (
    <button
      onClick={onSelect}
      className={`rounded-lg border-2 p-4 flex flex-col items-center justify-center aspect-square transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${statusClasses[table.status]}`}
    >
      <div className="mb-2">
        {table.status === 'occupied' 
          ? <UserGroupIcon className="h-8 w-8" /> 
          : <TableIcon className="h-8 w-8" />}
      </div>
      <span className="font-bold text-lg">{table.name}</span>
      <span className="text-sm capitalize">{table.status}</span>
    </button>
  );
};


const TableView: React.FC<TableViewProps> = ({ tables, onSelectTable }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
       <h1 className="text-3xl font-bold mb-6 text-text-main dark:text-text-dark-main">Select a Table</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {tables.map(table => (
          <TableCard key={table.id} table={table} onSelect={() => onSelectTable(table.id)} />
        ))}
      </div>
    </div>
  );
};

export default TableView;