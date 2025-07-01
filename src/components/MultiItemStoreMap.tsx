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
  const [visitedItems, setVisitedItems] = useState<number[]>([]);
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
      setVisitedItems([]);
      
      const interval = setInterval(() => {
        setAnimationStep(prev => {
          if (prev >= allPathCoordinates.length - 1) {
            setIsAnimating(false);
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [showRoute, allPathCoordinates.length]);

  useEffect(() => {
    if (optimalRoute && animationStep > 0) {
      let cumulativeSteps = 0;
      const newVisitedItems: number[] = [];
      
      for (let i = 0; i < optimalRoute.segments.length; i++) {
        cumulativeSteps += optimalRoute.segments[i].path.length;
        if (animationStep >= cumulativeSteps) {
          newVisitedItems.push(i);
        }
        if (animationStep <= cumulativeSteps) {
          setCurrentItemIndex(i);
          break;
        }
      }
      setVisitedItems(newVisitedItems);
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

  const isItemVisited = (x: number, y: number) => {
    if (!optimalRoute) return false;
    const itemIndex = optimalRoute.visitOrder.findIndex(item => 
      item.location.coordinates.x === x && item.location.coordinates.y === y
    );
    return itemIndex !== -1 && visitedItems.includes(itemIndex);
  };

  const getSectionAt = (x: number, y: number): StoreSection | null => {
    return storeSections.find(section => 
      x >= section.coordinates.x && 
      x < section.coordinates.x + section.coordinates.width &&
      y >= section.coordinates.y && 
      y < section.coordinates.y + section.coordinates.height
    ) || null;
  };

  const getPathProgress = () => {
    if (!allPathCoordinates.length) return 0;
    return ((animationStep + 1) / allPathCoordinates.length) * 100;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100 animate-pulse opacity-30"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50">
        {/* Header with floating elements */}
        <div className="mb-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Smart Shopping Navigator
              </h2>
            </div>
            {isAnimating && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <span className="text-sm font-medium">Navigating...</span>
              </div>
            )}
          </div>
          
          {/* Floating stats */}
          <div className="flex items-center gap-6 text-sm flex-wrap">
            {currentLocation && (
              <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-full border border-green-200 shadow-sm">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-700">Start: {currentLocation.name}</span>
              </div>
            )}
            {shoppingList.length > 0 && (
              <div className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded-full border border-red-200 shadow-sm">
                <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full"></div>
                <span className="font-medium text-red-700">{shoppingList.length} Items</span>
              </div>
            )}
            {optimalRoute && (
              <div className="flex items-center gap-2 bg-purple-100 px-3 py-2 rounded-full border border-purple-200 shadow-sm">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"></div>
                <span className="font-medium text-purple-700">{optimalRoute.totalDistance}ft route</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced map container */}
        <div className="relative bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl overflow-hidden shadow-inner border border-gray-200/50">
          <div 
            className="relative"
            style={{ 
              width: '100%',
              maxWidth: '900px',
              aspectRatio: `${gridSize.width}/${gridSize.height}`,
              margin: '0 auto'
            }}
          >
            {/* Enhanced store sections */}
            {storeSections.map(section => (
              <div
                key={section.id}
                className="absolute rounded-xl shadow-lg border-2 border-white/30 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] hover:z-10"
                style={{
                  left: `${(section.coordinates.x / gridSize.width) * 100}%`,
                  top: `${(section.coordinates.y / gridSize.height) * 100}%`,
                  width: `${(section.coordinates.width / gridSize.width) * 100}%`,
                  height: `${(section.coordinates.height / gridSize.height) * 100}%`,
                  background: `linear-gradient(135deg, ${section.color}, ${section.color}dd)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.1)`
                }}
              >
                {/* Animated section name */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span 
                    className="text-white font-bold text-center leading-tight px-3 py-2 rounded-lg bg-black/30 backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105 transition-transform duration-200"
                    style={{
                      fontSize: `${Math.max(0.7, Math.min(1.4, (section.coordinates.width + section.coordinates.height) / 7))}rem`,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    {section.name}
                  </span>
                </div>

                {/* Subtle animated overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 animate-pulse"></div>
              </div>
            ))}

            {/* Enhanced path visualization with glowing trail */}
            {showRoute && allPathCoordinates.length > 0 && (
              <>
                <svg
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{ width: '100%', height: '100%' }}
                  viewBox={`0 0 ${gridSize.width} ${gridSize.height}`}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="0.1" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Completed path with glow effect */}
                  {allPathCoordinates.slice(0, Math.max(0, animationStep)).map((coord, index) => {
                    if (index === 0) return null;
                    const prevCoord = allPathCoordinates[index - 1];
                    return (
                      <line
                        key={`completed-path-${index}`}
                        x1={prevCoord.x + 0.5}
                        y1={prevCoord.y + 0.5}
                        x2={coord.x + 0.5}
                        y2={coord.y + 0.5}
                        stroke="url(#pathGradient)"
                        strokeWidth="0.25"
                        filter="url(#glow)"
                        opacity="0.9"
                      />
                    );
                  })}

                  {/* Upcoming path preview */}
                  {allPathCoordinates.slice(animationStep).map((coord, index) => {
                    if (index === 0) return null;
                    const prevCoord = allPathCoordinates[animationStep + index - 1];
                    return (
                      <line
                        key={`preview-path-${index}`}
                        x1={prevCoord.x + 0.5}
                        y1={prevCoord.y + 0.5}
                        x2={coord.x + 0.5}
                        y2={coord.y + 0.5}
                        stroke="#94A3B8"
                        strokeWidth="0.15"
                        strokeDasharray="0.3,0.2"
                        opacity="0.4"
                      />
                    );
                  })}
                </svg>

                {/* Path dots for completed route */}
                {allPathCoordinates.slice(0, animationStep + 1).map((coord, index) => (
                  <div
                    key={`path-dot-${index}`}
                    className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 z-15"
                    style={{
                      left: `${((coord.x + 0.5) / gridSize.width) * 100}%`,
                      top: `${((coord.y + 0.5) / gridSize.height) * 100}%`,
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg animate-ping opacity-75"></div>
                  </div>
                ))}
              </>
            )}

            {/* Current location with enhanced animations */}
            {currentLocation && (
              <div
                className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 z-30"
                style={{
                  left: `${((currentLocation.x + 0.5) / gridSize.width) * 100}%`,
                  top: `${((currentLocation.y + 0.5) / gridSize.height) * 100}%`,
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced current step marker */}
            {isAnimating && animationStep < allPathCoordinates.length && (
              <div
                className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 z-25"
                style={{
                  left: `${((allPathCoordinates[animationStep].x + 0.5) / gridSize.width) * 100}%`,
                  top: `${((allPathCoordinates[animationStep].y + 0.5) / gridSize.height) * 100}%`,
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full animate-spin opacity-75"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white shadow-xl animate-bounce flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced destination markers */}
            {shoppingList.map((item, index) => {
              const destinationNumber = getDestinationNumber(item.location.coordinates.x, item.location.coordinates.y);
              const isVisited = isItemVisited(item.location.coordinates.x, item.location.coordinates.y);
              
              return (
                <div
                  key={item.id}
                  className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{
                    left: `${((item.location.coordinates.x + 0.5) / gridSize.width) * 100}%`,
                    top: `${((item.location.coordinates.y + 0.5) / gridSize.height) * 100}%`,
                  }}
                >
                  <div className="relative group">
                    {!isVisited && (
                      <div className="absolute inset-0 bg-red-300 rounded-full animate-ping opacity-75"></div>
                    )}
                    <div className={`relative w-full h-full rounded-full border-3 border-white shadow-xl flex items-center justify-center transform transition-all duration-500 ${
                      isVisited 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 scale-90' 
                        : 'bg-gradient-to-br from-red-500 to-pink-600 hover:scale-110'
                    }`}>
                      {isVisited ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {destinationNumber || index + 1}
                        </span>
                      )}
                    </div>
                    
                    {/* Enhanced tooltip */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl border border-gray-700">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-300 text-xs">{item.location.section}</div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced progress section */}
        {showRoute && allPathCoordinates.length > 0 && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200/50 rounded-2xl shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Navigation Progress
                </span>
              </div>
              <div className="bg-white/80 px-4 py-2 rounded-full shadow-sm border border-blue-200">
                <span className="text-sm font-medium text-blue-700">
                  {Math.min(animationStep + 1, allPathCoordinates.length)} / {allPathCoordinates.length} steps
                </span>
              </div>
            </div>
            
            <div className="relative w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${getPathProgress()}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            
            {optimalRoute && (
              <div className="flex items-center justify-center">
                <div className="bg-white/80 px-6 py-3 rounded-full shadow-sm border border-purple-200">
                  <span className="text-sm text-purple-700">
                    <span className="font-medium">Next destination:</span>{' '}
                    <span className="font-bold text-purple-800">
                      {currentItemIndex < optimalRoute.visitOrder.length 
                        ? optimalRoute.visitOrder[currentItemIndex].name 
                        : '🎉 Shopping Complete!'}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced shopping list */}
        {optimalRoute && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
              <h4 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Shopping Sequence
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {optimalRoute.visitOrder.map((item, index) => {
                const isCurrentItem = index === currentItemIndex && isAnimating;
                const isCompleted = visitedItems.includes(index);
                
                return (
                  <div 
                    key={item.id} 
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-500 transform ${
                      isCurrentItem 
                        ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 shadow-lg scale-105 animate-pulse' 
                        : isCompleted
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 shadow-sm'
                        : 'bg-white/80 border-2 border-gray-200 hover:shadow-md hover:scale-102'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isCurrentItem
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white animate-bounce'
                        : isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold truncate ${
                        isCurrentItem ? 'text-orange-800' : isCompleted ? 'text-green-800' : 'text-gray-800'
                      }`}>
                        {item.name}
                      </div>
                      <div className={`text-xs ${
                        isCurrentItem ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {item.location.section}
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="text-green-500 animate-bounce">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}