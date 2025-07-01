import React from 'react';
import { FoodItem } from '../types';
import { storeSections } from '../data/storeData';
import { findPathAvoidingSections } from '../utils/pathfinding';

interface StoreMapProps {
  selectedItem: FoodItem | null;
  showRoute: boolean;
}

export function StoreMap({ selectedItem, showRoute }: StoreMapProps) {
  const gridSize = { width: 24, height: 14 };
  const entranceLocation = { x: 2, y: 9 };

  const pathCoordinates = selectedItem && showRoute 
    ? findPathAvoidingSections(entranceLocation, selectedItem.location.coordinates)
    : [];

  const isOnPath = (x: number, y: number) => {
    return pathCoordinates.some(coord => coord.x === x && coord.y === y);
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

      <div className="relative overflow-hidden">
        {/* Section blocks as single tiles */}
        <div className="absolute left-0 top-0 w-full h-full z-10 pointer-events-none">
          {storeSections.map(section => (
            <div
              key={section.id}
              className="absolute border border-gray-300 rounded-lg"
              style={{
                left: `${(section.coordinates.x / gridSize.width) * 100}%`,
                top: `${(section.coordinates.y / gridSize.height) * 100}%`,
                width: `${(section.coordinates.width / gridSize.width) * 100}%`,
                height: `${(section.coordinates.height / gridSize.height) * 100}%`,
                backgroundColor: section.color,
                opacity: 0.85,
              }}
              title={section.name}
            />
          ))}
        </div>
        <div 
          className="grid gap-0 mx-auto relative z-20"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.height}, 1fr)`,
            width: '100%',
            maxWidth: '800px',
            aspectRatio: `${gridSize.width}/${gridSize.height}`,
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: gridSize.height }).map((_, y) =>
            Array.from({ length: gridSize.width }).map((_, x) => {
              // Find if this cell is inside a section
              const section = storeSections.find(section =>
                x >= section.coordinates.x &&
                x < section.coordinates.x + section.coordinates.width &&
                y >= section.coordinates.y &&
                y < section.coordinates.y + section.coordinates.height
              );
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
                    ${isEntrance ? 'bg-green-500 border-4 border-green-400 shadow-lg shadow-green-300' : ''}
                    ${isDestination ? 'bg-red-500 border-4 border-red-400 shadow-lg shadow-red-300 animate-pulse' : ''}
                    ${isPath && !isEntrance && !isDestination ? 'bg-blue-400 border-blue-500' : ''}
                  `}
                  style={{
                    aspectRatio: '1',
                    minHeight: '32px',
                    backgroundColor: (!isEntrance && !isDestination && !isPath && section) ? 'transparent' : undefined
                  }}
                  title={isEntrance ? 'Entrance' : isDestination ? 'Destination' : (section ? section.name : '')}
                >
                  {isEntrance && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                    </div>
                  )}
                  {isDestination && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Blue trail SVG above grid */}
        {showRoute && pathCoordinates.length > 1 && (
          <svg
            className="absolute left-0 top-0 pointer-events-none z-20"
            width="100%"
            height="100%"
            viewBox={`0 0 ${gridSize.width} ${gridSize.height}`}
            style={{
              width: '100%',
              height: '100%',
              aspectRatio: `${gridSize.width}/${gridSize.height}`,
              maxWidth: '800px',
              maxHeight: 'auto',
              overflow: 'hidden',
            }}
          >
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth={0.25}
              strokeLinejoin="round"
              strokeLinecap="round"
              points={pathCoordinates.map(p => `${p.x + 0.5},${p.y + 0.5}`).join(' ')}
            />
          </svg>
        )}
        {/* Section Labels above everything */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {storeSections.map(section => (
            <div
              key={section.id}
              className="absolute flex items-center justify-center text-black font-medium text-xs text-center leading-tight px-1"
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