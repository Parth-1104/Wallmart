import React, { useState } from 'react';
import { Store, MapPin, Navigation, ShoppingCart } from 'lucide-react';
import { Header } from './components/Header';
import { ShoppingListManager } from './components/ShoppingListManager';
import { MultiItemStoreMap } from './components/MultiItemStoreMap';
import { MultiItemNavigationPanel } from './components/MultiItemNavigationPanel';
import { LocationSelector } from './components/LocationSelector';
import { FoodItem } from './types';

function App() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Smart Shopping Navigation</h2>
          <p className="text-gray-600 mb-6">
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
          {/* Store Map - Takes up 2 columns on large screens */}
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
            
            <ShoppingListManager
              shoppingList={shoppingList}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onClearList={handleClearList}
            />
            
            <MultiItemNavigationPanel 
              shoppingList={shoppingList}
              currentLocation={currentLocation}
            />
          </div>
        </div>

        {/* Features Section */}
        {shoppingList.length === 0 && (
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Shopping List</h3>
              <p className="text-gray-600 text-sm">Add multiple items and create your personalized shopping list</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Navigation className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Optimal Route Planning</h3>
              <p className="text-gray-600 text-sm">AI-powered pathfinding calculates the most efficient shopping route</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Animated Navigation</h3>
              <p className="text-gray-600 text-sm">Watch your route come to life with smooth animations and progress tracking</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Store className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Time & Distance Savings</h3>
              <p className="text-gray-600 text-sm">Save 30-40% shopping time with optimized store navigation</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;