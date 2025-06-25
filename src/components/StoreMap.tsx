import React from 'react';
import { FoodItem, StoreSection } from '../types';
import { storeSections } from '../data/storeData';
import { generatePathCoordinates } from '../utils/pathfinding';

interface StoreMapProps {
  selectedItem: FoodItem | null;
  showRoute: boolean;
}

export function StoreMap({ selectedItem, showRoute }: StoreMapProps) {
  const gridSize = { width: 18, height: 10 };
  const entranceLocation = { x: 2, y: 9 };

  const pathCoordinates = selectedItem && showRoute 
    ? generatePathCoordinates(entranceLocation, selectedItem.location.coordinates)
    : [];

  const isOnPath = (x: number, y: number) => {
    return pathCoordinates.some(coord => coord.x === x && coord.y === y);
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
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Store Map</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Entrance</span>
          </div>
          {selectedItem && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Your Item</span>
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
              const isEntrance = x === entranceLocation.x && y === entranceLocation.y;
              const isDestination = selectedItem && 
                x === selectedItem.location.coordinates.x && 
                y === selectedItem.location.coordinates.y;
              const isPath = isOnPath(x, y);

              return (
                <div
                  key={`${x}-${y}`}
                  className={`
                    relative border border-gray-200 transition-all duration-300
                    ${section ? 'cursor-pointer hover:opacity-80' : 'bg-gray-50'}
                    ${isEntrance ? 'bg-green-500 border-green-600' : ''}
                    ${isDestination ? 'bg-red-500 border-red-600 animate-pulse' : ''}
                    ${isPath && !isEntrance && !isDestination ? 'bg-blue-400 border-blue-500' : ''}
                  `}
                  style={{
                    backgroundColor: section && !isEntrance && !isDestination && !isPath 
                      ? section.color 
                      : undefined,
                    aspectRatio: '1',
                    minHeight: '24px'
                  }}
                  title={section ? section.name : ''}
                >
                  {isEntrance && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                  {isDestination && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
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