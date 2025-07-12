import React from 'react';
import { useLocation } from 'react-router-dom';
import { MultiItemStoreMap } from '../components/MultiItemStoreMap';
import { FoodItem } from '../types';

export default function MapPage() {
  const { state } = useLocation();
  const shoppingList: FoodItem[] = state?.shoppingList || [];
  const currentLocation = state?.currentLocation || null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 ">
      <h1 className="text-3xl font-bold mb-6 ">Store Map</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Left Column - Store Map */}
        <div className="col-span-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h2 className="text-xl font-semibold text-white">Interactive Store Map</h2>
          </div>
          <MultiItemStoreMap
            shoppingList={shoppingList}
            currentLocation={currentLocation}
            showRoute={!!(shoppingList.length > 0 && currentLocation)}
          />
        </div>
        </div>
      
    </div>
  );
}
