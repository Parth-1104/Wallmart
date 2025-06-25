import { FoodItem, PathStep } from '../types';
import { calculateRoute, generatePathCoordinates } from './pathfinding';

export interface OptimalRouteSegment {
  destination: FoodItem;
  steps: PathStep[];
  distance: number;
  time: number;
  path: { x: number; y: number }[];
}

export interface OptimalRoute {
  visitOrder: FoodItem[];
  segments: OptimalRouteSegment[];
  totalDistance: number;
  estimatedTime: number;
  fullPath: { x: number; y: number }[];
}

// Calculate distance between two points
function calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
  return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

// Solve Traveling Salesman Problem using nearest neighbor heuristic
function findOptimalOrder(start: { x: number; y: number }, items: FoodItem[]): FoodItem[] {
  if (items.length <= 1) return items;

  const unvisited = [...items];
  const visited: FoodItem[] = [];
  let currentPosition = start;

  while (unvisited.length > 0) {
    // Find the nearest unvisited item
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(currentPosition, unvisited[0].location.coordinates);

    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(currentPosition, unvisited[i].location.coordinates);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    // Move to the nearest item
    const nearestItem = unvisited.splice(nearestIndex, 1)[0];
    visited.push(nearestItem);
    currentPosition = nearestItem.location.coordinates;
  }

  return visited;
}

// Enhanced algorithm that considers store layout and shopping patterns
function findSmartOptimalOrder(start: { x: number; y: number }, items: FoodItem[]): FoodItem[] {
  if (items.length <= 1) return items;

  // Group items by store sections for logical flow
  const sectionGroups: { [key: string]: FoodItem[] } = {};
  items.forEach(item => {
    if (!sectionGroups[item.location.section]) {
      sectionGroups[item.location.section] = [];
    }
    sectionGroups[item.location.section].push(item);
  });

  // Define optimal section visit order (based on typical store layout)
  const sectionOrder = [
    'produce', 'dairy', 'meat', 'deli', 'bakery', 
    'frozen', 'pantry', 'snacks', 'beverages', 'health'
  ];

  const orderedItems: FoodItem[] = [];

  // Visit sections in optimal order
  sectionOrder.forEach(sectionId => {
    if (sectionGroups[sectionId]) {
      // Within each section, use nearest neighbor
      const sectionItems = sectionGroups[sectionId];
      if (sectionItems.length === 1) {
        orderedItems.push(sectionItems[0]);
      } else {
        // Find the best starting point in this section
        const lastPosition = orderedItems.length > 0 
          ? orderedItems[orderedItems.length - 1].location.coordinates 
          : start;
        
        const sectionOptimal = findOptimalOrder(lastPosition, sectionItems);
        orderedItems.push(...sectionOptimal);
      }
      delete sectionGroups[sectionId];
    }
  });

  // Handle any remaining items not in predefined sections
  Object.values(sectionGroups).forEach(remainingItems => {
    const lastPosition = orderedItems.length > 0 
      ? orderedItems[orderedItems.length - 1].location.coordinates 
      : start;
    const remaining = findOptimalOrder(lastPosition, remainingItems);
    orderedItems.push(...remaining);
  });

  return orderedItems;
}

export function calculateOptimalRoute(
  startLocation: { x: number; y: number; name: string },
  shoppingList: FoodItem[]
): OptimalRoute {
  // Find the optimal visit order
  const visitOrder = findSmartOptimalOrder(startLocation, shoppingList);
  
  const segments: OptimalRouteSegment[] = [];
  const fullPath: { x: number; y: number }[] = [];
  let totalDistance = 0;
  let currentPosition = startLocation;

  // Calculate route for each segment
  visitOrder.forEach((item, index) => {
    const route = calculateRoute(currentPosition, item.location.coordinates);
    const segmentPath = generatePathCoordinates(currentPosition, item.location.coordinates);
    
    // Remove the first coordinate if it's not the very first segment to avoid duplication
    const pathToAdd = index === 0 ? segmentPath : segmentPath.slice(1);
    fullPath.push(...pathToAdd);
    
    segments.push({
      destination: item,
      steps: route.steps,
      distance: route.totalDistance,
      time: route.estimatedTime,
      path: segmentPath
    });

    totalDistance += route.totalDistance;
    currentPosition = item.location.coordinates;
  });

  const estimatedTime = Math.ceil(totalDistance / 100); // ~100 feet per minute walking

  return {
    visitOrder,
    segments,
    totalDistance,
    estimatedTime,
    fullPath
  };
}