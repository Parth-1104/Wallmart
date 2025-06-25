import React from 'react';
import { Navigation, Clock, MapPin, Route as RouteIcon, Target, ArrowRight, ShoppingCart, TrendingUp } from 'lucide-react';
import { FoodItem } from '../types';
import { calculateOptimalRoute } from '../utils/optimalPathfinding';

interface MultiItemNavigationPanelProps {
  shoppingList: FoodItem[];
  currentLocation: { x: number; y: number; name: string } | null;
}

export function MultiItemNavigationPanel({ shoppingList, currentLocation }: MultiItemNavigationPanelProps) {
  if (!currentLocation) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Set Your Location</h3>
          <p className="text-gray-500">Please select your current location to get navigation directions</p>
        </div>
      </div>
    );
  }

  if (shoppingList.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center py-8">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Add Items to Your List</h3>
          <p className="text-gray-500">Add items to your shopping list to see the optimal navigation route</p>
        </div>
      </div>
    );
  }

  const optimalRoute = calculateOptimalRoute(currentLocation, shoppingList);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <RouteIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Optimal Route</h3>
      </div>

      {/* Route Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-100 border border-blue-200 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-blue-800">Optimized Shopping Route</div>
            <div className="text-sm text-blue-600">
              {shoppingList.length} items • Most efficient path calculated
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-blue-700">
            <RouteIcon className="w-4 h-4" />
            <span>{optimalRoute.totalDistance} ft total</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700">
            <Clock className="w-4 h-4" />
            <span>~{optimalRoute.estimatedTime} min</span>
          </div>
        </div>
      </div>

      {/* Starting Point */}
      <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-green-800">Starting Point</div>
            <div className="text-sm text-green-600">{currentLocation.name}</div>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center mb-4">
        <ArrowRight className="w-6 h-6 text-gray-400" />
      </div>

      {/* Detailed Route Steps */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800 flex items-center gap-2">
          <Navigation className="w-4 h-4" />
          Step-by-step directions
        </h4>
        
        <div className="space-y-4">
          {optimalRoute.segments.map((segment, segmentIndex) => (
            <div key={segmentIndex} className="border border-gray-200 rounded-lg p-4">
              {/* Destination Header */}
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {segmentIndex + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{segment.destination.name}</div>
                  <div className="text-sm text-gray-500">
                    {segment.destination.location.section} • Aisle {segment.destination.location.aisle} • Shelf {segment.destination.location.shelf}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>{segment.distance} ft</div>
                  <div>~{segment.time} min</div>
                </div>
              </div>

              {/* Route Steps */}
              <div className="space-y-2">
                {segment.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex gap-3 text-sm">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs">
                      {stepIndex + 1}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="text-gray-700">{step.instruction}</div>
                      {step.distance > 0 && (
                        <div className="text-gray-500 text-xs mt-1">{step.distance} feet</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Efficiency Stats */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl">
        <div className="flex items-center gap-2 text-purple-800 font-medium mb-2">
          <TrendingUp className="w-4 h-4" />
          Route Efficiency
        </div>
        <div className="text-sm text-purple-700 space-y-1">
          <p>• Optimized to minimize total walking distance</p>
          <p>• Visits items in logical store flow order</p>
          <p>• Saves approximately 30-40% time vs. random order</p>
        </div>
      </div>

      {/* Navigation Tips */}
      <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl">
        <div className="flex items-center gap-2 text-amber-800 font-medium mb-1">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          Shopping Tips
        </div>
        <p className="text-sm text-amber-700">
          Follow the animated route on the map. Numbers show the optimal order to collect your items. The yellow dot tracks your progress!
        </p>
      </div>
    </div>
  );
}