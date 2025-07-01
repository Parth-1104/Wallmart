import React, { useState } from 'react';
import { foodItems, storeSections } from '../data/storeData';
import { FoodItem } from '../types';

// Helper to group items by category
function groupByCategory(items: FoodItem[]): { category: string; items: FoodItem[] }[] {
  const map = new Map<string, FoodItem[]>();
  items.forEach((item: FoodItem) => {
    if (!map.has(item.category)) map.set(item.category, []);
    map.get(item.category)!.push(item);
  });
  return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
}

export const Inventory: React.FC<{ onAddItem: (item: FoodItem) => void }> = ({ onAddItem }) => {
  // Search state
  const [query, setQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  // Filter items by section and query
  const filteredItems = foodItems.filter(item => {
    const matchesSection = selectedSection === 'all' || item.location.section === selectedSection;
    const matchesQuery =
      query.length === 0 ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());
    return matchesSection && matchesQuery;
  });

  // When 'all', group by category; else, group by section (single section)
  const grouped = selectedSection === 'all'
    ? groupByCategory(filteredItems)
    : [
        {
          category: storeSections.find(s => s.id === selectedSection)?.name || '',
          items: filteredItems.filter(item => item.location.section === selectedSection)
        }
      ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 w-8/12">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Live Store Inventory</h2>
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center mb-8">
        <select
          value={selectedSection}
          onChange={e => setSelectedSection(e.target.value)}
          className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white"
        >
          <option value="all">All Sections</option>
          {storeSections.map(section => (
            <option key={section.id} value={section.id}>{section.name}</option>
          ))}
        </select>
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for food items..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          )}
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </div>
      </div>
      <div className="space-y-8 mt-4">
        {grouped.map(group => (
          <div key={group.category} className="">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 rounded-lg mr-2 bg-blue-200"></div>
              <h3 className="text-xl font-semibold text-gray-900">{group.category}</h3>
              <span className="ml-2 text-xs text-gray-500">({group.items.length} items)</span>
            </div>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2 snap-x snap-mandatory">
                {group.items.length === 0 ? (
                  <div className="text-gray-400 italic px-4 py-6">No items in this category</div>
                ) : (
                  group.items.map((item: FoodItem, idx: number) => (
                    <div
                      key={item.id}
                      className="min-w-[220px] max-w-xs bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 rounded-xl p-4 flex flex-col items-center shadow-sm hover:shadow-xl transition-shadow duration-300 snap-center animate-fadeIn cursor-grab active:cursor-grabbing"
                      style={{ animationDelay: `${idx * 30}ms` }}
                      draggable
                      onDragStart={e => {
                        e.dataTransfer.setData('application/json', JSON.stringify(item));
                        e.currentTarget.classList.add('ring-4', 'ring-blue-400');
                      }}
                      onDragEnd={e => {
                        e.currentTarget.classList.remove('ring-4', 'ring-blue-400');
                      }}
                      title="Drag to add to shopping list"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <span className="text-lg font-bold text-blue-600">{item.name.charAt(0)}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h4>
                      <p className="text-gray-500 text-sm mb-1">Category: <span className="font-medium text-gray-700">{item.category}</span></p>
                      <p className="text-gray-400 text-xs">Aisle: {item.location.aisle}, Shelf: {item.location.shelf}</p>
                      <p className="text-gray-400 text-xs">Coords: ({item.location.coordinates.x}, {item.location.coordinates.y})</p>
                      <span className="mt-2 text-xs text-blue-400">Drag to Shopping List</span>
                    </div>
                  ))
                )}
              </div>
              {/* Left/Right scroll hint arrows */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md animate-bounce-left">
                  <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                </div>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md animate-bounce-right">
                  <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(.4,0,.2,1) both; }
        @keyframes bounce-left {
          0%, 100% { transform: translateY(-50%) translateX(0); }
          50% { transform: translateY(-50%) translateX(-8px); }
        }
        .animate-bounce-left { animation: bounce-left 1.2s infinite; }
        @keyframes bounce-right {
          0%, 100% { transform: translateY(-50%) translateX(0); }
          50% { transform: translateY(-50%) translateX(8px); }
        }
        .animate-bounce-right { animation: bounce-right 1.2s infinite; }
      `}</style>
    </div>
  );
}; 