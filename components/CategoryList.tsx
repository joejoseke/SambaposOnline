import React from 'react';
import type { Category } from '../types';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <>
      {/* Mobile: Horizontal Scroll */}
      <div className="md:hidden p-2">
        <h2 className="text-lg font-bold px-2 pb-2 text-text-main dark:text-text-dark-main">Categories</h2>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-text-secondary dark:text-text-dark-secondary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Desktop: Vertical List */}
      <nav className="hidden md:block p-2 h-full">
        <h2 className="text-xl font-bold p-3 text-text-main dark:text-text-dark-main">Categories</h2>
        <ul>
          {categories.map(category => (
            <li key={category}>
              <button
                onClick={() => onSelectCategory(category)}
                className={`w-full text-left p-3 rounded-md text-lg font-semibold transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary dark:text-text-dark-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default CategoryList;