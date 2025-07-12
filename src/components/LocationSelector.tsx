import React, { useState } from 'react';
import { MapPin, Navigation, Target } from 'lucide-react';
import { storeSections } from '../data/storeData';

interface LocationSelectorProps {
  onLocationSelect: (location: { x: number; y: number; name: string }) => void;
  selectedLocation: { x: number; y: number; name: string } | null;
}

export function LocationSelector({ onLocationSelect, selectedLocation }: LocationSelectorProps) {
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const predefinedLocations = [
    { x: 2, y: 9, name: 'Store Entrance' },
    ...storeSections.map(section => ({
      x: section.coordinates.x + Math.floor(section.coordinates.width / 2),
      y: section.coordinates.y + Math.floor(section.coordinates.height / 2),
      name: section.name
    }))
  ];

  const handleLocationSelect = (location: { x: number; y: number; name: string }) => {
    onLocationSelect(location);
    setShowLocationPicker(false);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <Target className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Your Current Location</h3>
      </div>

      {selectedLocation ? (
        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-green-800">{selectedLocation.name}</div>
                <div className="text-sm text-green-600">
                  Grid: ({selectedLocation.x}, {selectedLocation.y})
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowLocationPicker(true)}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowLocationPicker(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
        >
          <div className="flex items-center justify-center gap-3 text-gray-600 group-hover:text-blue-600">
            <Navigation className="w-6 h-6" />
            <span className="font-medium">Select Your Current Location</span>
          </div>
        </button>
      )}

      {showLocationPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose Your Location</h3>
              <p className="text-gray-600">Select where you are currently standing in the store</p>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {predefinedLocations.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full p-4 text-left border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{location.name}</div>
                        <div className="text-sm text-gray-500">Grid: ({location.x}, {location.y})</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowLocationPicker(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}