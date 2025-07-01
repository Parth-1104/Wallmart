export interface FoodItem {
  id: string;
  name: string;
  category: string;
  location: {
    section: string;
    aisle: number;
    shelf: string;
    coordinates: { x: number; y: number };
  };
  deal?: string;
}

export interface StoreSection {
  id: string;
  name: string;
  color: string;
  coordinates: { x: number; y: number; width: number; height: number };
}

export interface PathStep {
  instruction: string;
  distance: number;
  coordinates: { x: number; y: number };
}

export interface Route {
  steps: PathStep[];
  totalDistance: number;
  estimatedTime: number;
}