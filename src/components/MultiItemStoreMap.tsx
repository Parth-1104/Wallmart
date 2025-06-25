import React, { useState, useEffect } from 'react';
import { FoodItem, StoreSection } from '../types';
import { storeSections } from '../data/storeData';
import { calculateOptimalRoute } from '../utils/optimalPathfinding';

interface MultiItemStoreMapProps {
  shoppingList: FoodItem[];
  currentLocation: { x: number; y: number; name: string } | null;
  showRoute: boolean;
}

export function MultiItemStoreMap({ shoppingList, currentLocation, showRoute }: MultiItemStoreMapProps) {
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const gridSize = { width: 18, height: 10 };

  const optimalRoute = currentLocation && shoppingList.length > 0 && showRoute 
    ? calculateOptimalRoute(currentLocation, shoppingList)
    : null;

  const allPathCoordinates = optimalRoute ? optimalRoute.fullPath : [];

  useEffect(() => {
    if (showRoute && allPathCoordinates.length > 0) {
      setIsAnimating(true);
      setAnimationStep(0);
      setCurrentItemIndex(0);
      
      const interval = setInterval(() => {
        setAnimationStep(prev => {
          if (prev >= allPathCoordinates.length - 1) {
            setIsAnimating(false);
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 200); // Faster animation for longer paths

      return () => clearInterval(interval);
    }
  }, [showRoute, allPathCoordinates.length]);

  // Update current item index based on animation progress
  useEffect(() => {
    if (optimalRoute && animationStep > 0) {
      let cumulativeSteps = 0;
      for (let i = 0; i < optimalRoute.segments.length; i++) {
        cumulativeSteps += optimalRoute.segments[i].path.length;
        if (animationStep <= cumulativeSteps) {
          setCurrentItemIndex(i);
          break;
        }
      }
    }
  }, [animationStep, optimalRoute]);

  const isOnPath = (x: number, y: number) => {
    if (!showRoute) return false;
    const pathIndex = allPathCoordinates.findIndex(coord => coord.x === x && coord.y === y);
    return pathIndex !== -1 && pathIndex <= animationStep;
  };

  const isCurrentStep = (x: number, y: number) => {
    if (!isAnimating || animationStep >= allPathCoordinates.length) return false;
    const currentCoord = allPathCoordinates[animationStep];
    return currentCoord && currentCoord.x === x && currentCoord.y === y;
  };

  const isDestination = (x: number, y: number) => {
    return shoppingList.some(item => 
      item.location.coordinates.x === x && item.location.coordinates.y === y
    );
  };

  const getDestinationNumber = (x: number, y: number) => {
    if (!optimalRoute) return null;
    const itemIndex = optimalRoute.visitOrder.findIndex(item => 
      item.location.coordinates.x === x && item.location.coordinates.y === y
    );
    return itemIndex !== -1 ? itemIndex + 1 : null;
  };

  const getSectionAt = (x: number, y: number): StoreSection | null => {
    return storeSections.find(section => 
      x >= section.coordinates.x && 
      x < section.coordinates.x + section.coordinates.width &&
      y >= section.coordinates.y && 
      y < section.coordinates.y + section.coordinates.height
    ) || null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-800">Optimal Shopping Route</h2>
          {isAnimating && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Following optimal path...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
          {currentLocation && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Start ({currentLocation.name})</span>
            </div>
          )}
          {shoppingList.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>{shoppingList.length} Items</span>
            </div>
          )}
          {showRoute && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Optimal Route</span>
            </div>
          )}
          {optimalRoute && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>{optimalRoute.totalDistance} ft total</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div 
          className="grid gap-1 mx-auto"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.height}, 1fr)`,
            maxWidth: '800px',
            aspectRatio: `${gridSize.width}/${gridSize.height}`
          }}
        >
          {Array.from({ length: gridSize.height }).map((_, y) =>
            Array.from({ length: gridSize.width }).map((_, x) => {
              const section = getSectionAt(x, y);
              const isCurrentLocation = currentLocation && 
                x === currentLocation.x && y === currentLocation.y;
              const isItemDestination = isDestination(x, y);
              const destinationNumber = getDestinationNumber(x, y);
              const isPath = isOnPath(x, y);
              const isCurrent = isCurrentStep(x, y);

              return (
                <div
                  key={`${x}-${y}`}
                  className={`
                    relative border border-gray-200 transition-all duration-300 ease-in-out
                    ${section ? 'cursor-pointer hover:opacity-80' : 'bg-gray-50'}
                    ${isCurrentLocation ? 'bg-green-500 border-green-600 shadow-lg' : ''}
                    ${isItemDestination ? 'bg-red-500 border-red-600 shadow-lg' : ''}
                    ${isPath && !isCurrentLocation && !isItemDestination ? 'bg-blue-400 border-blue-500' : ''}
                    ${isCurrent ? 'bg-yellow-400 border-yellow-500 shadow-lg scale-110 z-10' : ''}
                  `}
                  style={{
                    backgroundColor: section && !isCurrentLocation && !isItemDestination && !isPath && !isCurrent
                      ? section.color 
                      : undefined,
                    aspectRatio: '1',
                    minHeight: '24px',
                    transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                    zIndex: isCurrent ? 10 : (isItemDestination ? 5 : 1)
                  }}
                  title={section ? section.name : ''}
                >
                  {isCurrentLocation && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full shadow-md"></div>
                    </div>
                  )}
                  {isItemDestination && destinationNumber && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs font-bold text-red-600 shadow-md">
                        {destinationNumber}
                      </div>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce shadow-md"></div>
                    </div>
                  )}
                  {isPath && !isCurrentLocation && !isItemDestination && !isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full opacity-80"></div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Section Labels */}
        <div className="absolute inset-0 pointer-events-none">
          {storeSections.map(section => (
            <div
              key={section.id}
              className="absolute flex items-center justify-center text-white font-medium text-xs text-center leading-tight px-1"
              style={{
                left: `${(section.coordinates.x / gridSize.width) * 100}%`,
                top: `${(section.coordinates.y / gridSize.height) * 100}%`,
                width: `${(section.coordinates.width / gridSize.width) * 100}%`,
                height: `${(section.coordinates.height / gridSize.height) * 100}%`,
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {section.name}
            </div>
          ))}
        </div>
      </div>

      {/* Route Progress */}
      {showRoute && allPathCoordinates.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-100 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Shopping Progress</span>
            <span className="text-sm text-blue-600">
              {Math.min(animationStep + 1, allPathCoordinates.length)} / {allPathCoordinates.length} steps
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${((animationStep + 1) / allPathCoordinates.length) * 100}%` 
              }}
            ></div>
          </div>
          {optimalRoute && (
            <div className="text-sm text-blue-700">
              Currently heading to: <span className="font-medium">
                {currentItemIndex < optimalRoute.visitOrder.length 
                  ? optimalRoute.visitOrder[currentItemIndex].name 
                  : 'Complete!'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Shopping List Order */}
      {optimalRoute && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl">
          <h4 className="font-medium text-green-800 mb-3">Optimal Visit Order</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {optimalRoute.visitOrder.map((item, index) => (
              <div 
                key={item.id} 
                className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                  index === currentItemIndex && isAnimating 
                    ? 'bg-yellow-200 border border-yellow-400 shadow-md' 
                    : 'bg-white border border-green-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === currentItemIndex && isAnimating
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
      )}

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {storeSections.filter(s => s.id !== 'entrance' && s.id !== 'checkout').map(section => (
          <div key={section.id} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: section.color }}
            ></div>
            <span className="text-xs text-gray-600">{section.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}