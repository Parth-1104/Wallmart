import React, { useState, useEffect } from 'react';
import { FoodItem } from '../types';
import { storeSections } from '../data/storeData';
import { calculateOptimalRoute } from '../utils/optimalPathfinding';
import { findPathAvoidingSections } from '../utils/pathfinding';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface MultiItemStoreMapProps {
  shoppingList: FoodItem[];
  currentLocation: { x: number; y: number; name: string } | null;
  showRoute: boolean;
}

export function MultiItemStoreMap({ shoppingList, currentLocation, showRoute }: MultiItemStoreMapProps) {
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const maxX = Math.max(...storeSections.map(s => s.coordinates.x + s.coordinates.width));
  const maxY = Math.max(...storeSections.map(s => s.coordinates.y + s.coordinates.height));
  const gridSize = { width: maxX + 2, height: maxY + 2 }; // add padding for buffer


  const optimalRoute = currentLocation && shoppingList.length > 0 && showRoute 
    ? calculateOptimalRoute(currentLocation, shoppingList)
    : null;

  let allPathCoordinates: { x: number; y: number }[] = [];
  if (optimalRoute) {
    let prev = currentLocation;
    optimalRoute.visitOrder.forEach((item, idx) => {
      if (prev) {
        const prevCoords = { x: prev.x, y: prev.y };
        const segPath = findPathAvoidingSections(prevCoords, item.location.coordinates);
        allPathCoordinates = allPathCoordinates.concat(idx === 0 ? segPath : segPath.slice(1));
        prev = { ...item.location.coordinates, name: item.name };
      }
    });
  }

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

  // Dynamic island status for multi-item
  const currentStep = showRoute && allPathCoordinates.length > 1 ? animationStep + 1 : 0;
  const totalSteps = allPathCoordinates.length;
  let direction = null;
  if (showRoute && allPathCoordinates.length > 1 && animationStep < allPathCoordinates.length - 1) {
    const from = allPathCoordinates[animationStep];
    const to = allPathCoordinates[animationStep + 1];
    if (to.x > from.x) direction = 'right';
    else if (to.x < from.x) direction = 'left';
    else if (to.y > from.y) direction = 'down';
    else if (to.y < from.y) direction = 'up';
  }
  const currentItem = optimalRoute && currentItemIndex < optimalRoute.visitOrder.length ? optimalRoute.visitOrder[currentItemIndex] : null;
  const hasDeal = currentItem && currentItem.deal;

  return (
    <div className="bg-white bg-opacity-95 p-6 rounded-3xl shadow-xl border border-gray-200 relative w-full max-w-7xl mx-auto">

      {/* Dynamic Island */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-8 z-40 px-6 py-3 rounded-full shadow-xl bg-black/80 flex items-center gap-4 text-white text-base font-medium min-w-[260px] max-w-[90vw] border border-gray-900/30">
        <span>
          {currentStep === 0 ? 'Start' : `Step ${currentStep} / ${totalSteps}`}
        </span>
        {direction === 'up' && <ArrowUp className="w-5 h-5 text-blue-300" />}
        {direction === 'down' && <ArrowDown className="w-5 h-5 text-blue-300" />}
        {direction === 'left' && <ArrowLeft className="w-5 h-5 text-blue-300" />}
        {direction === 'right' && <ArrowRight className="w-5 h-5 text-blue-300" />}
        {currentItem && (
          <span className="truncate">→ {currentItem.name}</span>
        )}
        {hasDeal && (
          <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded ml-2 animate-pulse">{currentItem.deal}</span>
        )}
      </div>

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
  className="grid gap-0 mx-auto relative z-20 w-full max-w-[800px]"
  style={{ 
    gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize.height}, 1fr)`,
    aspectRatio: `${gridSize.width}/${gridSize.height}`,
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
              const isCurrentLocation = currentLocation && 
                x === currentLocation.x && y === currentLocation.y;
              const isItemDestination = isDestination(x, y);
              const isDeal = isItemDestination && hasDeal;
              const destinationNumber = getDestinationNumber(x, y);
              const isPath = isOnPath(x, y);

              return (
                <div
                  key={`${x}-${y}`}
                  className={`
                    relative border border-gray-200 transition-all duration-300 ease-in-out
                    ${isCurrentLocation ? 'bg-green-500 border-4 border-green-400 shadow-lg shadow-green-300' : ''}
                    ${isItemDestination ? `bg-red-500 border-4 ${isDeal ? 'border-yellow-400 shadow-lg shadow-yellow-300 animate-pulse' : 'border-red-400 shadow-lg shadow-red-300'}` : ''}
                    ${isPath && !isCurrentLocation && !isItemDestination ? 'bg-blue-400 border-blue-500' : ''}
                  `}
                  style={{
                    aspectRatio: '1',
                    minHeight: '32px',
                    zIndex: isItemDestination ? 5 : 1,
                    backgroundColor: (!isCurrentLocation && !isItemDestination && !isPath && section) ? 'transparent' : undefined
                  }}
                  title={isCurrentLocation ? 'Start' : isItemDestination ? 'Destination' : (section ? section.name : '')}
                >
                  {isCurrentLocation && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-red rounded-full shadow-md"></div>
                    </div>
                  )}
                  {isItemDestination && destinationNumber && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-red-600 shadow-md">
                        {destinationNumber}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Blue trail SVG with direction arrows */}
        {showRoute && allPathCoordinates.length > 1 && (
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
              points={allPathCoordinates.map(p => `${p.x + 0.5},${p.y + 0.5}`).join(' ')}
            />
            {/* Direction arrows on path */}
            {allPathCoordinates.slice(0, -1).map((from, i) => {
              const to = allPathCoordinates[i + 1];
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

      {/* Route Progress */}
      {showRoute && allPathCoordinates.length > 0 && (
        <div className="mt-4 p-4 bg-transparent  border border-blue-200 rounded-xl">
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