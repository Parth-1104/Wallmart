import React from 'react';
import { Navigation, Clock, MapPin, Route as RouteIcon, Target, ArrowRight } from 'lucide-react';
import { FoodItem, Route } from '../types';
import { calculateRoute } from '../utils/pathfinding';

interface EnhancedNavigationPanelProps {
  selectedItem: FoodItem | null;
  currentLocation: { x: number; y: number; name: string } | null;
}

export function EnhancedNavigationPanel({ selectedItem, currentLocation }: EnhancedNavigationPanelProps) {
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

  if (!selectedItem) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center py-8">
          <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Ready to Navigate</h3>
          <p className="text-gray-500">Search for an item to see navigation instructions from your current location</p>
        </div>
      </div>
    );
  }

  const route = calculateRoute(currentLocation, selectedItem.location.coordinates);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <RouteIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Navigation</h3>
      </div>

      {/* Current Location */}
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

      {/* Destination */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-blue-800">{selectedItem.name}</div>
            <div className="text-sm text-blue-600">
              {selectedItem.location.section} • Aisle {selectedItem.location.aisle} • Shelf {selectedItem.location.shelf}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-blue-700">
          <div className="flex items-center gap-1">
            <RouteIcon className="w-4 h-4" />
            <span>{route.totalDistance} ft</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>~{route.estimatedTime} min</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-800 flex items-center gap-2">
          <Navigation className="w-4 h-4" />
          Step-by-step directions
        </h4>
        
        <div className="space-y-3">
          {route.steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1 pt-1">
                <div className="text-gray-800">{step.instruction}</div>
                {step.distance > 0 && (
                  <div className="text-sm text-gray-500 mt-1">Distance: {step.distance} feet</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl">
        <div className="flex items-center gap-2 text-purple-800 font-medium mb-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          Navigation Tips
        </div>
        <p className="text-sm text-purple-700">
          Watch the animated route on the map above. The yellow dot shows your progress, and the red destination will pulse when you arrive!
        </p>
      </div>
    </div>
  );
}