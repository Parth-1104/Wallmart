import { Route, PathStep } from '../types';
import { storeSections } from '../data/storeData';

export function calculateRoute(start: { x: number; y: number }, end: { x: number; y: number }): Route {
  const steps: PathStep[] = [];
  let currentX = start.x;
  const currentY = start.y;
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

// Returns true if (x, y) is inside any section (except allowedSectionId)
function isBlocked(x: number, y: number, allowedSectionId?: string): boolean {
  for (const section of storeSections) {
    if (
      x >= section.coordinates.x &&
      x < section.coordinates.x + section.coordinates.width &&
      y >= section.coordinates.y &&
      y < section.coordinates.y + section.coordinates.height &&
      section.id !== allowedSectionId
    ) {
      return true;
    }
  }
  return false;
}

// BFS pathfinding avoiding sections
export function findPathAvoidingSections(
  start: { x: number; y: number },
  end: { x: number; y: number }
): { x: number; y: number }[] {
  const queue: { x: number; y: number; path: { x: number; y: number }[] }[] = [
    { x: start.x, y: start.y, path: [{ x: start.x, y: start.y }] }
  ];
  const visited = new Set<string>();
  const endSection = storeSections.find(section =>
    end.x >= section.coordinates.x &&
    end.x < section.coordinates.x + section.coordinates.width &&
    end.y >= section.coordinates.y &&
    end.y < section.coordinates.y + section.coordinates.height
  );
  const allowedSectionId = endSection?.id;

  while (queue.length > 0) {
    const { x, y, path } = queue.shift()!;
    if (x === end.x && y === end.y) return path;
    const key = `${x},${y}`;
    if (visited.has(key)) continue;
    visited.add(key);
    for (const [dx, dy] of [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      // Only block horizontal moves through sections
      let blocked = false;
      if ((dx === 1 || dx === -1) && isBlocked(nx, ny, allowedSectionId)) {
        blocked = true;
      }
      // Vertical moves are always allowed, even through sections
      if (
        nx < 0 || ny < 0 || nx > 30 || ny > 30 ||
        blocked ||
        visited.has(`${nx},${ny}`)
      ) {
        continue;
      }
      queue.push({ x: nx, y: ny, path: [...path, { x: nx, y: ny }] });
    }
  }
  return [start]; // fallback: just start
}