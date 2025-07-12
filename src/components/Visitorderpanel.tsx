import React from 'react';
import { FoodItem } from '../types';

interface VisitOrderPanelProps {
  visitOrder: FoodItem[];
  currentIndex: number;
  isAnimating: boolean;
}

export function VisitOrderPanel({ visitOrder, currentIndex, isAnimating }: VisitOrderPanelProps) {
  return (
    <div className="w-full lg:max-w-xs p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl">
      <h4 className="font-medium text-green-800 mb-3">Optimal Visit Order</h4>
      <div className="grid grid-cols-1 gap-2">
        {visitOrder.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
              index === currentIndex && isAnimating
                ? 'bg-yellow-200 border border-yellow-400 shadow-md'
                : 'bg-white border border-green-200'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              index === currentIndex && isAnimating
                ? 'bg-yellow-500 text-white'
                : 'bg-green-500 text-white'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-800 truncate">{item.name}</div>
              <div className="text-xs text-gray-500">{item.location.section}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
