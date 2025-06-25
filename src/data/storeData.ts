import { FoodItem, StoreSection } from '../types';

export const storeSections: StoreSection[] = [
  { id: 'entrance', name: 'Entrance', color: '#6B7280', coordinates: { x: 1, y: 9, width: 2, height: 1 } },
  { id: 'produce', name: 'Fresh Produce', color: '#059669', coordinates: { x: 1, y: 1, width: 4, height: 3 } },
  { id: 'dairy', name: 'Dairy & Eggs', color: '#2563EB', coordinates: { x: 6, y: 1, width: 3, height: 2 } },
  { id: 'meat', name: 'Meat & Seafood', color: '#DC2626', coordinates: { x: 10, y: 1, width: 3, height: 2 } },
  { id: 'bakery', name: 'Bakery', color: '#D97706', coordinates: { x: 14, y: 1, width: 3, height: 2 } },
  { id: 'deli', name: 'Deli', color: '#7C3AED', coordinates: { x: 6, y: 4, width: 3, height: 2 } },
  { id: 'frozen', name: 'Frozen Foods', color: '#0891B2', coordinates: { x: 10, y: 4, width: 3, height: 2 } },
  { id: 'pantry', name: 'Pantry Staples', color: '#CA8A04', coordinates: { x: 14, y: 4, width: 3, height: 2 } },
  { id: 'snacks', name: 'Snacks & Candy', color: '#EC4899', coordinates: { x: 1, y: 5, width: 4, height: 2 } },
  { id: 'beverages', name: 'Beverages', color: '#8B5CF6', coordinates: { x: 6, y: 7, width: 5, height: 2 } },
  { id: 'health', name: 'Health & Beauty', color: '#F59E0B', coordinates: { x: 12, y: 7, width: 5, height: 2 } },
  { id: 'checkout', name: 'Checkout', color: '#374151', coordinates: { x: 4, y: 9, width: 9, height: 1 } },
];

export const foodItems: FoodItem[] = [
  // Produce
  { id: '1', name: 'Apples', category: 'Fruit', location: { section: 'produce', aisle: 1, shelf: 'A', coordinates: { x: 2, y: 2 } } },
  { id: '2', name: 'Bananas', category: 'Fruit', location: { section: 'produce', aisle: 1, shelf: 'B', coordinates: { x: 3, y: 2 } } },
  { id: '3', name: 'Carrots', category: 'Vegetable', location: { section: 'produce', aisle: 2, shelf: 'A', coordinates: { x: 2, y: 3 } } },
  { id: '4', name: 'Spinach', category: 'Vegetable', location: { section: 'produce', aisle: 2, shelf: 'B', coordinates: { x: 3, y: 3 } } },
  { id: '5', name: 'Tomatoes', category: 'Vegetable', location: { section: 'produce', aisle: 1, shelf: 'C', coordinates: { x: 4, y: 2 } } },
  
  // Dairy
  { id: '6', name: 'Milk', category: 'Dairy', location: { section: 'dairy', aisle: 3, shelf: 'A', coordinates: { x: 7, y: 1 } } },
  { id: '7', name: 'Eggs', category: 'Dairy', location: { section: 'dairy', aisle: 3, shelf: 'B', coordinates: { x: 8, y: 1 } } },
  { id: '8', name: 'Cheese', category: 'Dairy', location: { section: 'dairy', aisle: 3, shelf: 'C', coordinates: { x: 7, y: 2 } } },
  { id: '9', name: 'Yogurt', category: 'Dairy', location: { section: 'dairy', aisle: 3, shelf: 'D', coordinates: { x: 8, y: 2 } } },
  
  // Meat & Seafood
  { id: '10', name: 'Chicken Breast', category: 'Meat', location: { section: 'meat', aisle: 4, shelf: 'A', coordinates: { x: 11, y: 1 } } },
  { id: '11', name: 'Ground Beef', category: 'Meat', location: { section: 'meat', aisle: 4, shelf: 'B', coordinates: { x: 12, y: 1 } } },
  { id: '12', name: 'Salmon', category: 'Seafood', location: { section: 'meat', aisle: 4, shelf: 'C', coordinates: { x: 11, y: 2 } } },
  
  // Bakery
  { id: '13', name: 'Bread', category: 'Bakery', location: { section: 'bakery', aisle: 5, shelf: 'A', coordinates: { x: 15, y: 1 } } },
  { id: '14', name: 'Croissants', category: 'Bakery', location: { section: 'bakery', aisle: 5, shelf: 'B', coordinates: { x: 16, y: 1 } } },
  
  // Deli
  { id: '15', name: 'Turkey Slices', category: 'Deli', location: { section: 'deli', aisle: 6, shelf: 'A', coordinates: { x: 7, y: 4 } } },
  { id: '16', name: 'Ham', category: 'Deli', location: { section: 'deli', aisle: 6, shelf: 'B', coordinates: { x: 8, y: 4 } } },
  
  // Frozen
  { id: '17', name: 'Ice Cream', category: 'Frozen', location: { section: 'frozen', aisle: 7, shelf: 'A', coordinates: { x: 11, y: 4 } } },
  { id: '18', name: 'Frozen Pizza', category: 'Frozen', location: { section: 'frozen', aisle: 7, shelf: 'B', coordinates: { x: 12, y: 4 } } },
  
  // Pantry
  { id: '19', name: 'Rice', category: 'Pantry', location: { section: 'pantry', aisle: 8, shelf: 'A', coordinates: { x: 15, y: 4 } } },
  { id: '20', name: 'Pasta', category: 'Pantry', location: { section: 'pantry', aisle: 8, shelf: 'B', coordinates: { x: 16, y: 4 } } },
  
  // Snacks
  { id: '21', name: 'Chips', category: 'Snacks', location: { section: 'snacks', aisle: 9, shelf: 'A', coordinates: { x: 2, y: 5 } } },
  { id: '22', name: 'Cookies', category: 'Snacks', location: { section: 'snacks', aisle: 9, shelf: 'B', coordinates: { x: 3, y: 5 } } },
  
  // Beverages
  { id: '23', name: 'Orange Juice', category: 'Beverages', location: { section: 'beverages', aisle: 10, shelf: 'A', coordinates: { x: 8, y: 7 } } },
  { id: '24', name: 'Soda', category: 'Beverages', location: { section: 'beverages', aisle: 10, shelf: 'B', coordinates: { x: 9, y: 7 } } },
  
  // Health & Beauty
  { id: '25', name: 'Shampoo', category: 'Health', location: { section: 'health', aisle: 11, shelf: 'A', coordinates: { x: 14, y: 7 } } },
  { id: '26', name: 'Toothpaste', category: 'Health', location: { section: 'health', aisle: 11, shelf: 'B', coordinates: { x: 15, y: 7 } } },
];