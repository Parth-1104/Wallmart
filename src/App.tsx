import React, { useState } from 'react';
import { Store, MapPin, Navigation, ShoppingCart } from 'lucide-react';
import { Header } from './components/Header';
import { ShoppingListManager } from './components/ShoppingListManager';
import { MultiItemStoreMap } from './components/MultiItemStoreMap';
import { MultiItemNavigationPanel } from './components/MultiItemNavigationPanel';
import { LocationSelector } from './components/LocationSelector';
import { FoodItem } from './types';
import { Inventory } from './components/Inventory';
import Chatbot from '../chatbot/chat';
import {BackgroundBeamsDemo} from'./components/Herohome'


function App() {
  

  return (
    <div className='w-full h-full'>
      <BackgroundBeamsDemo/>


      
      
      <div className="fixed bottom-4 right-4 z-50">
        <Chatbot />
      </div>
    </div>

  );
}

export default App;