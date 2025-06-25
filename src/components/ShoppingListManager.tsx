import React, { useState } from 'react';
import { Plus, X, ShoppingCart, Route, Trash2 } from 'lucide-react';
import { FoodItem } from '../types';
import { foodItems } from '../data/storeData';

interface ShoppingListManagerProps {
  shoppingList: FoodItem[];
  onAddItem: (item: FoodItem) => void;
  onRemoveItem: (itemId: string) => void;
  onClearList: () => void;
}

export function ShoppingListManager({ shoppingList, onAddItem, onRemoveItem, onClearList }: ShoppingListManagerProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length > 0) {
      const filtered = foodItems.filter(item =>
        !shoppingList.find(listItem => listItem.id === item.id) &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.category.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleAddItem = (item: FoodItem) => {
    onAddItem(item);
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <ShoppingCart className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-800">Shopping List</h3>
        {shoppingList.length > 0 && (
          <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
            {shoppingList.length} items
          </span>
        )}
      </div>

      {/* Add Item Search */}
      <div className="relative mb-4">
        <div className="relative">
          <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Add items to your shopping list..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {suggestions.map(item => (
              <button
                key={item.id}
                onClick={() => handleAddItem(item)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.category} • Aisle {item.location.aisle}</div>
                </div>
                <Plus className="w-4 h-4 text-green-500" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Shopping List Items */}
      {shoppingList.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-700">Your Items</h4>
            <button
              onClick={onClearList}
              className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
          
          {shoppingList.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{item.name}</div>
                <div className="text-sm text-gray-500">
                  {item.location.section} • Aisle {item.location.aisle} • Shelf {item.location.shelf}
                </div>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>Your shopping list is empty</p>
          <p className="text-sm">Add items above to get started</p>
        </div>
      )}

      {shoppingList.length > 1 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 font-medium mb-1">
            <Route className="w-4 h-4" />
            Optimal Route
          </div>
          <p className="text-sm text-blue-700">
            We'll calculate the most efficient path through all {shoppingList.length} items to minimize your walking distance.
          </p>
        </div>
      )}
    </div>
  );
}