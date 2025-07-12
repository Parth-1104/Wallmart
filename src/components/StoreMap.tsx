import React, { useState, useEffect, useRef } from 'react';
import { FoodItem } from '../types';
import { storeSections } from '../data/storeData';
import { findPathAvoidingSections } from '../utils/pathfinding';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface StoreMapProps {
  selectedItem: FoodItem | null;
  showRoute: boolean;
}

// Section tips for flash cards (move outside component for clarity)
const sectionTips: Record<string, string> = {
  Produce: 'Fresh fruits and veggies are restocked daily!',
  Dairy: 'Check the back for the coldest milk.',
  Bakery: 'Try our new artisan breads!',
  Meat: 'Ask the butcher for custom cuts.',
  Frozen: 'Frozen foods are perfect for quick meals.',
  Household: 'Stock up on cleaning essentials!',
  Pets: "Don't forget treats for your furry friends!",
  Electronics: 'Check out the latest gadgets!',
  Clothing: 'New arrivals every week!',
  Toys: 'Find the perfect gift for kids!',
  Stationery: 'Back-to-school deals available!',
  Checkout: "Ready to check out? Don't forget your coupons!"
  // Add more as needed
};

export function StoreMap({ selectedItem, showRoute }: StoreMapProps) {
  const gridSize = { width: 24, height: 14 };
  const entranceLocation = { x: 2, y: 9 };

  const pathCoordinates = selectedItem && showRoute 
    ? findPathAvoidingSections(entranceLocation, selectedItem.location.coordinates)
    : [];

  const isOnPath = (x: number, y: number) => {
    return pathCoordinates.some(coord => coord.x === x && coord.y === y);
  };

  // Dynamic island status
  const currentStep = showRoute && pathCoordinates.length > 1 ? 1 : 0;
  const totalSteps = pathCoordinates.length;
  let direction = null;
  const hasDeal = selectedItem && selectedItem.deal;
  if (showRoute && pathCoordinates.length > 1) {
    const from = pathCoordinates[0];
    const to = pathCoordinates[1];
    if (to.x > from.x) direction = 'right';
    else if (to.x < from.x) direction = 'left';
    else if (to.y > from.y) direction = 'down';
    else if (to.y < from.y) direction = 'up';
  }

  const [flashCard, setFlashCard] = useState<{ sectionName: string; tip: string } | null>(null);
  const lastSectionRef = useRef<string | null>(null);

  // Only reset flash card when navigation is turned off or item is cleared
  useEffect(() => {
    if (!showRoute || !selectedItem) {
      lastSectionRef.current = null;
      setFlashCard(null);
    }
  }, [selectedItem, showRoute]);

  // Show flash card for the destination section as soon as the route is shown
  useEffect(() => {
    if (!showRoute || !selectedItem) return;
    const destinationCoord = selectedItem.location.coordinates;
    const destinationSection = storeSections.find(section =>
      destinationCoord.x >= section.coordinates.x &&
      destinationCoord.x < section.coordinates.x + section.coordinates.width &&
      destinationCoord.y >= section.coordinates.y &&
      destinationCoord.y < section.coordinates.y + section.coordinates.height
    );
    if (destinationSection) {
      setFlashCard({
        sectionName: destinationSection.name,
        tip: sectionTips[destinationSection.name] || 'Enjoy shopping in this section!'
      });
      const timeout = setTimeout(() => setFlashCard(null), 3200);
      return () => clearTimeout(timeout);
    }
  }, [showRoute, selectedItem, storeSections]);

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 p-6 rounded-3xl shadow-2xl border border-gray-100 relative">
      {/* Dynamic Island */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-8 z-40 px-6 py-3 rounded-full shadow-xl bg-black/80 flex items-center gap-4 text-white text-base font-medium min-w-[260px] max-w-[90vw] border border-gray-900/30">
        <span>
          {currentStep === 0 ? 'Start' : `Step ${currentStep} / ${totalSteps}`}
        </span>
        {direction === 'up' && <ArrowUp className="w-5 h-5 text-blue-300" />}
        {direction === 'down' && <ArrowDown className="w-5 h-5 text-blue-300" />}
        {direction === 'left' && <ArrowLeft className="w-5 h-5 text-blue-300" />}
        {direction === 'right' && <ArrowRight className="w-5 h-5 text-blue-300" />}
        {selectedItem && (
          <span className="truncate">→ {selectedItem.name}</span>
        )}
        {hasDeal && (
          <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded ml-2 animate-pulse">{selectedItem.deal}</span>
        )}
      </div>

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
              const isDeal = isDestination && hasDeal;
              const isPath = isOnPath(x, y);

              return (
                <div
                  key={`${x}-${y}`}
                  className={`
                    relative border border-gray-200 transition-all duration-300
                    ${isEntrance ? 'bg-green-500 border-4 border-green-400 shadow-lg shadow-green-300' : ''}
                    ${isDestination ? `bg-red-500 border-4 ${isDeal ? 'border-yellow-400 shadow-lg shadow-yellow-300 animate-pulse' : 'border-red-400 shadow-lg shadow-red-300 animate-pulse'}` : ''}
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

        {/* Blue trail SVG with direction arrows */}
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
            {/* Direction arrows on path */}
            {pathCoordinates.slice(0, -1).map((from, i) => {
              const to = pathCoordinates[i + 1];
              let arrow = null;
              if (to.x > from.x) arrow = <ArrowRight className="w-3 h-3 text-blue-500" />;
              else if (to.x < from.x) arrow = <ArrowLeft className="w-3 h-3 text-blue-500" />;
              else if (to.y > from.y) arrow = <ArrowDown className="w-3 h-3 text-blue-500" />;
              else if (to.y < from.y) arrow = <ArrowUp className="w-3 h-3 text-blue-500" />;
              return (
                <foreignObject
                  key={i}
                  x={from.x + 0.25}
                  y={from.y + 0.25}
                  width={0.5}
                  height={0.5}
                  style={{ overflow: 'visible' }}
                >
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {arrow}
                  </div>
                </foreignObject>
              );
            })}
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

      {/* Section Flash Card Popover */}
      {flashCard && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={`Now entering ${flashCard.sectionName}`}
          className="fixed left-1/2 top-24 z-50 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border-2 border-blue-300 px-8 py-6 flex flex-col items-center animate-fade-in-up focus:outline-none"
          tabIndex={0}
        >
          <div className="text-lg font-bold text-blue-700 mb-1">{flashCard.sectionName}</div>
          <div className="text-gray-700 text-base mb-2">{flashCard.tip}</div>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2" />
        </div>
      )}
    </div>
  );
}