"use client";
import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

import { BackgroundBeams } from "../components/ui/Background";
import { ShoppingCart } from 'lucide-react';

import { ShoppingListManager } from './ShoppingListManager';
import { MultiItemNavigationPanel } from './MultiItemNavigationPanel';
import { LocationSelector } from './LocationSelector';
import { FoodItem } from '../types';
import { Inventory } from './Inventory';
import BlurText from "./Text"; 

export function BackgroundBeamsDemo() {
  const [shoppingList, setShoppingList] = useState<FoodItem[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ x: number; y: number; name: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll function
  const handleAutoScroll = useCallback((e: DragEvent) => {
    const scrollThreshold = 50; // pixels from edge to trigger scroll
    const scrollSpeed = 10; // pixels per scroll
    const viewport = {
      top: 0,
      bottom: window.innerHeight,
      left: 0,
      right: window.innerWidth
    };

    const mouseY = e.clientY;
    const mouseX = e.clientX;
    
    let scrollX = 0;
    let scrollY = 0;

    // Vertical scrolling
    if (mouseY < scrollThreshold) {
      scrollY = -scrollSpeed;
    } else if (mouseY > viewport.bottom - scrollThreshold) {
      scrollY = scrollSpeed;
    }

    // Horizontal scrolling
    if (mouseX < scrollThreshold) {
      scrollX = -scrollSpeed;
    } else if (mouseX > viewport.right - scrollThreshold) {
      scrollX = scrollSpeed;
    }

    // Perform scroll if needed
    if (scrollX !== 0 || scrollY !== 0) {
      window.scrollBy(scrollX, scrollY);
    }
  }, []);

  // Start auto-scroll when dragging starts
  const startAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) return;

    const handleDragMove = (e: DragEvent) => {
      handleAutoScroll(e);
    };

    document.addEventListener('dragover', handleDragMove);
    
    // Store the cleanup function
    scrollIntervalRef.current = setInterval(() => {
      // This interval ensures we continue checking even if dragover events are sparse
    }, 50) as NodeJS.Timeout;

    // Cleanup function
    const cleanup = () => {
      document.removeEventListener('dragover', handleDragMove);
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    // Set up cleanup on drag end
    const handleDragEnd = () => {
      cleanup();
      setIsDragging(false);
      document.removeEventListener('dragend', handleDragEnd);
    };

    document.addEventListener('dragend', handleDragEnd);
  }, [handleAutoScroll]);

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

  const goToMap = () => {
    navigate('/map', {
      state: {
        shoppingList,
        currentLocation,
      },
    });
  };

  // Enhanced drag handlers with auto-scroll
  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    startAutoScroll();
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative overflow-hidden">
      <BackgroundBeams />
      
      {/* Header Section */}
      <header className="relative z-10 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BlurText
            text="Smart Shopping Navigation"
            delay={0}
            animateBy="words"
            direction="top"
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          />
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Create your shopping list and get the most efficient route through our store with real-time animated navigation.
          </p>

          {shoppingList.length > 0 && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium shadow-lg">
              <ShoppingCart className="w-5 h-5" />
              <span>{shoppingList.length} items in your list</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column - Inventory */}
            <div className="lg:col-span-1">
              <div 
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl"
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-white">Store Inventory</h2>
                </div>
                <Inventory onAddItem={handleAddItem} />
              </div>
            </div>

            {/* Center Column - Shopping List */}
            <div className="lg:col-span-1">
              <div
                onDragOver={e => {
                  e.preventDefault();
                  e.currentTarget.classList.add('ring-4', 'ring-green-400', 'ring-opacity-50');
                }}
                onDragLeave={e => {
                  e.currentTarget.classList.remove('ring-4', 'ring-green-400', 'ring-opacity-50');
                }}
                onDrop={e => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('ring-4', 'ring-green-400', 'ring-opacity-50');
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
                className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl transition-all duration-300 min-h-[400px] ${
                  isDragging ? 'ring-2 ring-blue-400 ring-opacity-50 scale-105' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-white">Shopping List</h2>
                </div>
                <ShoppingListManager
                  shoppingList={shoppingList}
                  onAddItem={handleAddItem}
                  onRemoveItem={handleRemoveItem}
                  onClearList={handleClearList}
                />
              </div>
            </div>

            {/* Right Column - Navigation & Controls */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Location Selector */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-white">Your Location</h2>
                </div>
                <LocationSelector
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={currentLocation}
                />
              </div>

              {/* Map Navigation Button */}
              {shoppingList.length > 0 && currentLocation && (
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 shadow-2xl">
                  <button
                    onClick={goToMap}
                    className="w-full bg-white/20 backdrop-blur-sm text-white py-4 px-6 rounded-xl hover:bg-white/30 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    🗺️ View Store Map
                  </button>
                </div>
              )}

              {/* Navigation Panel */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-white">Navigation</h2>
                </div>
                <MultiItemNavigationPanel
                  shoppingList={shoppingList}
                  currentLocation={currentLocation}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}