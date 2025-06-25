import React from 'react';
import { Navigation, Clock, MapPin, Route as RouteIcon } from 'lucide-react';
import { FoodItem, Route } from '../types';
import { calculateRoute } from '../utils/pathfinding';

interface NavigationPanelProps {
  selectedItem: FoodItem | null;
}

export function NavigationPanel({ selectedItem }: NavigationPanelProps) {
  if (!selectedItem) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center py-8">
          <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Ready to Navigate</h3>
          <p className="text-gray-500">Search for an item to see navigation instructions</p>
        </div>
      </div>
    );
  }

  const entranceLocation = { x: 2, y: 9 };
  const route = calculateRoute(entranceLocation, selectedItem.location.coordinates);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <RouteIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Navigation</h3>
      </div>

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

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Pro Tip
        </div>
        <p className="text-sm text-green-700">
          Follow the blue path on the map above. The red dot shows your destination, and it will pulse when you're close!
        </p>
      </div>
    </div>
  );
}