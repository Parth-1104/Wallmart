import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

// Pastel color palette for categories
const pastelColors = [
  'from-[#ffe0ec] to-[#e0f7fa]', // pink to blue
  'from-[#fff5ba] to-[#baffc9]', // yellow to green
  'from-[#bae1ff] to-[#ffd1dc]', // blue to pink
  'from-[#baffc9] to-[#fff5ba]', // green to yellow
  'from-[#ffd1dc] to-[#bae1ff]', // pink to blue
  'from-[#e0f7fa] to-[#ffe0ec]', // blue to pink
];

export const Inventory: React.FC<{ onAddItem: (item: FoodItem) => void }> = ({ onAddItem }) => {
  // Search state
  const [query, setQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  
  // Refs for scroll containers
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Scroll function
  const scroll = (direction: 'left' | 'right', containerKey: string) => {
    const container = scrollRefs.current[containerKey];
    if (!container) return;
    
    const scrollAmount = 240; // Adjust scroll distance
    const currentScroll = container.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

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
    <div className="w-full max-w-5xl mx-auto mt-8 ">
      <h2 className="text-3xl font-extrabold mb-10 text-center text-gray-50 tracking-tight drop-shadow-lg">Live Store Inventory</h2>
      
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center mb-10 ">
        <select
          value={selectedSection}
          onChange={e => setSelectedSection(e.target.value)}
          className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 bg-white font-semibold shadow-sm"
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
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500 font-medium shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
              aria-label="Clear search"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          )}
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </div>
      </div>

      <div className="space-y-12">
        {grouped.map((group, groupIdx) => (
          <section
            key={group.category}
            className={`rounded-3xl shadow-xl border border-gray-200 bg-white/80 backdrop-blur-md transition-all duration-300`}
          >
            {/* Section Header */}
            <div
              className={`flex items-center justify-between px-8 py-4 rounded-t-3xl border-b border-gray-100 bg-gradient-to-r ${pastelColors[groupIdx % pastelColors.length]} shadow-sm`}
            >
              <div className="flex items-center gap-3">
                <span className="inline-block px-4 py-1 rounded-full bg-white/60 text-gray-700 text-base font-bold shadow tracking-wide border border-gray-200">
                  {group.category}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-semibold">{group.items.length} items</span>
            </div>

            {/* Items Scroll Area with Navigation Buttons */}
            <div className="relative px-4 py-6">
              {/* Left Scroll Button */}
              <button
                onClick={() => scroll('left', group.category)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-gray-200"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              {/* Right Scroll Button */}
              <button
                onClick={() => scroll('right', group.category)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-gray-200"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>

              {/* Scrollable Container */}
              <div 
                ref={el => scrollRefs.current[group.category] = el}
                className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2 snap-x snap-mandatory px-12"
                style={{ scrollbarWidth: 'thin' }}
              >
                {group.items.length === 0 ? (
                  <div className="text-gray-400 italic px-4 py-6">No items in this category</div>
                ) : (
                  group.items.map((item: FoodItem, idx: number) => (
                    <div
                      key={item.id}
                      className="min-w-[220px] max-w-xs bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 snap-center animate-fadeIn cursor-grab active:cursor-grabbing relative group"
                      style={{ animationDelay: `${idx * 30}ms` }}
                      draggable
                      onDragStart={e => {
                        e.dataTransfer.setData('application/json', JSON.stringify(item));
                        e.currentTarget.classList.add('ring-4', 'ring-blue-300');
                      }}
                      onDragEnd={e => {
                        e.currentTarget.classList.remove('ring-4', 'ring-blue-300');
                      }}
                      title="Drag to add to shopping list"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-white via-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3 shadow group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl font-extrabold text-blue-400 drop-shadow-lg">{item.name.charAt(0)}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-lg mb-1 tracking-wide text-center drop-shadow-md">{item.name}</h4>
                      <p className="text-gray-500 text-sm mb-1 text-center">Category: <span className="font-semibold text-blue-400/90">{item.category}</span></p>
                      <p className="text-gray-400 text-xs">Aisle: {item.location.aisle}, Shelf: {item.location.shelf}</p>
                      <p className="text-gray-400 text-xs mb-2">Coords: ({item.location.coordinates.x}, {item.location.coordinates.y})</p>
                      <span className="mt-2 text-xs text-blue-400 group-hover:text-pink-400 transition-colors">Drag to Shopping List</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(.4,0,.2,1) both; }
        
        /* Custom scrollbar styles */
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};