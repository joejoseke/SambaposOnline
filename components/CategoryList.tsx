
import React from 'react';
import type { Category } from '../types';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <nav className="p-2 h-full">
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
  );
};

export default CategoryList;