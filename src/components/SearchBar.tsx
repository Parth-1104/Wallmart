import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { FoodItem } from '../types';
import { foodItems, storeSections } from '../data/storeData';

interface SearchBarProps {
  onItemSelect: (item: FoodItem) => void;
  selectedItem: FoodItem | null;
  onClear: () => void;
}

export function SearchBar({ onItemSelect, selectedItem, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [showDealsOnly, setShowDealsOnly] = useState(false);

  useEffect(() => {
    if (query.length > 0 || selectedSection !== 'all' || showDealsOnly) {
      const filtered = foodItems.filter(item =>
        (query.length === 0 || 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())) &&
        (selectedSection === 'all' || item.location.section === selectedSection) &&
        (!showDealsOnly || item.deal)
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, selectedSection, showDealsOnly]);

  const handleSelectItem = (item: FoodItem) => {
    setQuery(item.name);
    setShowSuggestions(false);
    onItemSelect(item);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onClear();
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(e.target.value);
  };

  const handleDealsOnlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowDealsOnly(e.target.checked);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Section/category dropdown and deals filter */}
      <div className="flex items-center gap-3 mb-2">
        <select
          value={selectedSection}
          onChange={handleSectionChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white"
        >
          <option value="all">All Sections</option>
          {storeSections.map(section => (
            <option key={section.id} value={section.id}>{section.name}</option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-xs text-blue-700 whitespace-nowrap">
          <input type="checkbox" checked={showDealsOnly} onChange={handleDealsOnlyChange} className="accent-blue-600" />
          Show Deals Only
        </label>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for food items..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
        />
        {(query || selectedItem) && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {suggestions.map(item => (
            <button
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-gray-800 flex items-center gap-2">
                  {item.name}
                  {item.deal && (
                    <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded ml-1">{item.deal}</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">{item.category} • Aisle {item.location.aisle}</div>
              </div>
              <div className="text-xs text-gray-400">{item.location.section}</div>
            </button>
          ))}
        </div>
      )}

      {selectedItem && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-blue-800">{selectedItem.name}</div>
              <div className="text-sm text-blue-600">
                {selectedItem.location.section} • Aisle {selectedItem.location.aisle} • Shelf {selectedItem.location.shelf}
              </div>
            </div>
            <button
              onClick={handleClear}
              className="text-blue-400 hover:text-blue-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}