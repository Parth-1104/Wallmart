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
  { id: 'clothing', name: 'Clothing', color: '#A21CAF', coordinates: { x: 1, y: 13, width: 4, height: 1 } },
  { id: 'toys', name: 'Toys', color: '#F59E42', coordinates: { x: 6, y: 15, width: 4, height: 2 } },
  { id: 'stationery', name: 'Stationery', color: '#6366F1', coordinates: { x: 12, y: 15, width: 4, height: 2 } },
  { id: 'checkout', name: 'Checkout', color: '#374151', coordinates: { x: 4, y: 18, width: 9, height: 1 } },
  { id: 'household', name: 'Household Supplies', color: '#10B981', coordinates: { x: 18, y: 1, width: 4, height: 2 } },
  { id: 'pets', name: 'Pet Supplies', color: '#F43F5E', coordinates: { x: 18, y: 4, width: 4, height: 2 } },
  { id: 'electronics', name: 'Electronics', color: '#3B82F6', coordinates: { x: 18, y: 7, width: 4, height: 2 } },
];

export const foodItems: FoodItem[] = [
  // Produce
  { id: '1', name: 'Apples', category: 'Fruit', location: { section: 'produce', aisle: 1, shelf: 'A', coordinates: { x: 2, y: 2 } } },
  { id: '2', name: 'Bananas', category: 'Fruit', location: { section: 'produce', aisle: 1, shelf: 'B', coordinates: { x: 4, y: 2 } } },
  { id: '3', name: 'Carrots', category: 'Vegetable', location: { section: 'produce', aisle: 2, shelf: 'A', coordinates: { x: 2, y: 3 } } },
  { id: '4', name: 'Spinach', category: 'Vegetable', location: { section: 'produce', aisle: 2, shelf: 'B', coordinates: { x: 4, y: 3 } } },
  
  // Dairy
  { id: '5', name: 'Milk', category: 'Dairy', location: { section: 'dairy', aisle: 3, shelf: 'A', coordinates: { x: 7, y: 1 } } },
  { id: '6', name: 'Eggs', category: 'Dairy', location: { section: 'dairy', aisle: 3, shelf: 'B', coordinates: { x: 8, y: 2 } } },
  
  // Meat & Seafood
  { id: '7', name: 'Chicken Breast', category: 'Meat', location: { section: 'meat', aisle: 4, shelf: 'A', coordinates: { x: 11, y: 1 } } },
  { id: '8', name: 'Salmon', category: 'Seafood', location: { section: 'meat', aisle: 4, shelf: 'B', coordinates: { x: 12, y: 2 } } },
  
  // Bakery
  { id: '9', name: 'Bread', category: 'Bakery', location: { section: 'bakery', aisle: 5, shelf: 'A', coordinates: { x: 15, y: 1 } } },
  { id: '10', name: 'Croissants', category: 'Bakery', location: { section: 'bakery', aisle: 5, shelf: 'B', coordinates: { x: 16, y: 2 } } },
  
  // Deli
  { id: '11', name: 'Turkey Slices', category: 'Deli', location: { section: 'deli', aisle: 6, shelf: 'A', coordinates: { x: 7, y: 4 } } },
  
  // Frozen
  { id: '12', name: 'Ice Cream', category: 'Frozen', location: { section: 'frozen', aisle: 7, shelf: 'A', coordinates: { x: 12, y: 4 } } },
  
  // Pantry
  { id: '13', name: 'Rice', category: 'Pantry', location: { section: 'pantry', aisle: 8, shelf: 'A', coordinates: { x: 15, y: 4 } } },
  
  // Snacks
  { id: '14', name: 'Chips', category: 'Snacks', location: { section: 'snacks', aisle: 9, shelf: 'A', coordinates: { x: 2, y: 5 } } },
  
  // Beverages
  { id: '15', name: 'Orange Juice', category: 'Beverages', location: { section: 'beverages', aisle: 10, shelf: 'A', coordinates: { x: 8, y: 7 } } },
  
  // Health & Beauty
  { id: '16', name: 'Shampoo', category: 'Health', location: { section: 'health', aisle: 11, shelf: 'A', coordinates: { x: 14, y: 7 } } },
  
  // New items in new sections
  { id: '17', name: 'Laundry Detergent', category: 'Household', location: { section: 'household', aisle: 12, shelf: 'A', coordinates: { x: 19, y: 1 } } },
  { id: '18', name: 'Dog Food', category: 'Pets', location: { section: 'pets', aisle: 13, shelf: 'A', coordinates: { x: 19, y: 4 } } },
  { id: '19', name: 'Cat Litter', category: 'Pets', location: { section: 'pets', aisle: 13, shelf: 'B', coordinates: { x: 21, y: 5 } } },
  { id: '20', name: 'TV', category: 'Electronics', location: { section: 'electronics', aisle: 14, shelf: 'A', coordinates: { x: 19, y: 7 } } },
  { id: '21', name: 'Headphones', category: 'Electronics', location: { section: 'electronics', aisle: 14, shelf: 'B', coordinates: { x: 21, y: 8 } } },
  { id: '22', name: 'T-shirt', category: 'Clothing', location: { section: 'clothing', aisle: 15, shelf: 'A', coordinates: { x: 2, y: 13 } } },
  { id: '23', name: 'Jeans', category: 'Clothing', location: { section: 'clothing', aisle: 15, shelf: 'B', coordinates: { x: 4, y: 13 } } },
  { id: '24', name: 'Action Figure', category: 'Toys', location: { section: 'toys', aisle: 16, shelf: 'A', coordinates: { x: 7, y: 15 } } },
  { id: '25', name: 'Board Game', category: 'Toys', location: { section: 'toys', aisle: 16, shelf: 'B', coordinates: { x: 9, y: 16 } } },
  { id: '26', name: 'Notebook', category: 'Stationery', location: { section: 'stationery', aisle: 17, shelf: 'A', coordinates: { x: 13, y: 15 } } },
  { id: '27', name: 'Pen Pack', category: 'Stationery', location: { section: 'stationery', aisle: 17, shelf: 'B', coordinates: { x: 15, y: 16 } } },
  { id: '28', name: 'Reusable Bag', category: 'Checkout', location: { section: 'checkout', aisle: 18, shelf: 'A', coordinates: { x: 5, y: 18 } } },
  { id: '29', name: 'Gift Card', category: 'Checkout', location: { section: 'checkout', aisle: 18, shelf: 'B', coordinates: { x: 11, y: 18 } } },
];