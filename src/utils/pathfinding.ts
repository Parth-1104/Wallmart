import { Route, PathStep } from '../types';

export function calculateRoute(start: { x: number; y: number }, end: { x: number; y: number }): Route {
  const steps: PathStep[] = [];
  let currentX = start.x;
  let currentY = start.y;
  let totalDistance = 0;

  // Simple pathfinding algorithm - Manhattan distance with waypoints
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  // Move horizontally first if needed
  if (deltaX !== 0) {
    const direction = deltaX > 0 ? 'east' : 'west';
    const distance = Math.abs(deltaX) * 10; // 10 feet per grid unit
    totalDistance += distance;
    
    steps.push({
      instruction: `Head ${direction} for ${distance} feet`,
      distance,
      coordinates: { x: end.x, y: currentY }
    });
    currentX = end.x;
  }

  // Then move vertically
  if (deltaY !== 0) {
    const direction = deltaY > 0 ? 'south' : 'north';
    const distance = Math.abs(deltaY) * 10;
    totalDistance += distance;
    
    steps.push({
      instruction: `Turn and head ${direction} for ${distance} feet`,
      distance,
      coordinates: { x: currentX, y: end.y }
    });
  }

  steps.push({
    instruction: 'You have arrived at your destination',
    distance: 0,
    coordinates: end
  });

  const estimatedTime = Math.ceil(totalDistance / 100); // ~100 feet per minute walking

  return {
    steps,
    totalDistance,
    estimatedTime
  };
}

export function generatePathCoordinates(start: { x: number; y: number }, end: { x: number; y: number }): { x: number; y: number }[] {
  const path: { x: number; y: number }[] = [start];
  
  // Move horizontally first
  if (start.x !== end.x) {
    const step = start.x < end.x ? 1 : -1;
    for (let x = start.x + step; step > 0 ? x <= end.x : x >= end.x; x += step) {
      path.push({ x, y: start.y });
    }
  }
  
  // Then move vertically
  if (start.y !== end.y) {
    const step = start.y < end.y ? 1 : -1;
    for (let y = start.y + step; step > 0 ? y <= end.y : y >= end.y; y += step) {
      path.push({ x: end.x, y });
    }
  }
  
  return path;
}