"use client";
import React, { useState } from "react";
import { BackgroundBeams } from "../components/ui/Background";
import { Store, MapPin, Navigation, ShoppingCart } from 'lucide-react';

import { Header } from './Header';
import { ShoppingListManager } from './ShoppingListManager';
import { MultiItemStoreMap } from './MultiItemStoreMap';
import { MultiItemNavigationPanel } from './MultiItemNavigationPanel';
import { LocationSelector } from './LocationSelector';
import { FoodItem } from '../types/index';
import { Inventory } from './Inventory';
import BlurText from "./Text"; 

export function BackgroundBeamsDemo() {
  const [shoppingList, setShoppingList] = useState<FoodItem[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ x: number; y: number; name: string } | null>(null);

  const handleAddItem = (item: FoodItem) => {
    if (!shoppingList.find(listItem => listItem.id === item.id)) {
      setShoppingList(prev => [...prev, item]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== itemId));
  };

  const handleClearList = () => {
    setShoppingList([]);
  };

  const handleLocationSelect = (location: { x: number; y: number; name: string }) => {
    setCurrentLocation(location);
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-start antialiased pt-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        {/* Header Section */}
        <div className="mb-8 mt-7 text-center">
        <BlurText
          text="Smart Shopping Navigation"
          delay={0}
          animateBy="words"
          direction="top"
          className="text-7xl font-bold text-white text-center"
        />
          <h2 className="text-3xl font-bold text-white mb-2"></h2>
          <p className="text-gray-300 mb-6">
            Create your shopping list and get the most efficient route through our store with real-time animated navigation
          </p>

          {shoppingList.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <ShoppingCart className="w-4 h-4" />
              <span>{shoppingList.length} items in your list</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Store Map */}
          <div className="lg:col-span-2">
            <MultiItemStoreMap
              shoppingList={shoppingList}
              currentLocation={currentLocation}
              showRoute={!!(shoppingList.length > 0 && currentLocation)}
            />
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1 space-y-6">
            <LocationSelector
              onLocationSelect={handleLocationSelect}
              selectedLocation={currentLocation}
            />
            <MultiItemNavigationPanel
              shoppingList={shoppingList}
              currentLocation={currentLocation}
            />
          </div>
        </div>

        {/* Inventory + Shopping List */}
        <div className="flex flex-col lg:flex-row gap-8 mt-12 items-start justify-center">
          <Inventory onAddItem={handleAddItem} />
          <div
            onDragOver={e => {
              e.preventDefault();
              e.currentTarget.classList.add('ring-4', 'ring-green-400');
            }}
            onDragLeave={e => {
              e.currentTarget.classList.remove('ring-4', 'ring-green-400');
            }}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.classList.remove('ring-4', 'ring-green-400');
              try {
                const data = e.dataTransfer.getData('application/json');
                if (data) {
                  const item = JSON.parse(data);
                  handleAddItem(item);
                }
              } catch (err) {
                console.error("Invalid drag-drop data:", err);
              }
            }}
            className="transition-all w-full lg:w-[28rem]"
          >
            <ShoppingListManager
              shoppingList={shoppingList}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onClearList={handleClearList}
            />
          </div>
        </div>

        {/* Optional Features Section */}
        {/* Uncomment if needed */}
        {/*
        {shoppingList.length === 0 && (
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            ...
          </div>
        )}
        */}
      </main>
      <BackgroundBeams />
    </div>
  );
}
