import React, { useState, useEffect } from 'react';
import { FoodItem, StoreSection } from '../types';
import { storeSections } from '../data/storeData';
import { generatePathCoordinates } from '../utils/pathfinding';

interface AnimatedStoreMapProps {
  selectedItem: FoodItem | null;
  currentLocation: { x: number; y: number; name: string } | null;
  showRoute: boolean;
}

export function AnimatedStoreMap({ selectedItem, currentLocation, showRoute }: AnimatedStoreMapProps) {
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const gridSize = { width: 18, height: 10 };

  const pathCoordinates = selectedItem && currentLocation && showRoute 
    ? generatePathCoordinates(currentLocation, selectedItem.location.coordinates)
    : [];

  useEffect(() => {
    if (showRoute && pathCoordinates.length > 0) {
      setIsAnimating(true);
      setAnimationStep(0);
      
      const interval = setInterval(() => {
        setAnimationStep(prev => {
          if (prev >= pathCoordinates.length - 1) {
            setIsAnimating(false);
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [showRoute, pathCoordinates.length]);

  const isOnPath = (x: number, y: number) => {
    if (!showRoute) return false;
    const pathIndex = pathCoordinates.findIndex(coord => coord.x === x && coord.y === y);
    return pathIndex !== -1 && pathIndex <= animationStep;
  };

  const isCurrentStep = (x: number, y: number) => {
    if (!isAnimating || animationStep >= pathCoordinates.length) return false;
    const currentCoord = pathCoordinates[animationStep];
    return currentCoord && currentCoord.x === x && currentCoord.y === y;
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
          <h2 className="text-xl font-semibold text-gray-800">Store Map</h2>
          {isAnimating && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Showing route...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
          {currentLocation && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Your Location</span>
            </div>
          )}
          {selectedItem && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>Destination</span>
            </div>
          )}
          {showRoute && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Route</span>
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
              const isDestination = selectedItem && 
                x === selectedItem.location.coordinates.x && 
                y === selectedItem.location.coordinates.y;
              const isPath = isOnPath(x, y);
              const isCurrent = isCurrentStep(x, y);

              return (
                <div
                  key={`${x}-${y}`}
                  className={`
                    relative border border-gray-200 transition-all duration-500 ease-in-out
                    ${section ? 'cursor-pointer hover:opacity-80' : 'bg-gray-50'}
                    ${isCurrentLocation ? 'bg-green-500 border-green-600 shadow-lg' : ''}
                    ${isDestination ? 'bg-red-500 border-red-600 animate-pulse shadow-lg' : ''}
                    ${isPath && !isCurrentLocation && !isDestination ? 'bg-blue-400 border-blue-500' : ''}
                    ${isCurrent ? 'bg-yellow-400 border-yellow-500 shadow-lg scale-110 z-10' : ''}
                  `}
                  style={{
                    backgroundColor: section && !isCurrentLocation && !isDestination && !isPath && !isCurrent
                      ? section.color 
                      : undefined,
                    aspectRatio: '1',
                    minHeight: '24px',
                    transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                    zIndex: isCurrent ? 10 : 1
                  }}
                  title={section ? section.name : ''}
                >
                  {isCurrentLocation && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full shadow-md"></div>
                    </div>
                  )}
                  {isDestination && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    </div>
                  )}
                  {isPath && !isCurrentLocation && !isDestination && !isCurrent && (
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
      {showRoute && pathCoordinates.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Route Progress</span>
            <span className="text-sm text-blue-600">
              {Math.min(animationStep + 1, pathCoordinates.length)} / {pathCoordinates.length} steps
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${((animationStep + 1) / pathCoordinates.length) * 100}%` 
              }}
            ></div>
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