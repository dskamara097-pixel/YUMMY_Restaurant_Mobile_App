export interface FoodModel {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  currency: 'SLE';
  imageUrl?: string;
  ingredients: string[];
  discount?: number;
  preparationTimeMinutes?: number;
  calories?: number;
  popular?: boolean;
  archived?: boolean;
  stockStatus?: 'inStock' | 'lowStock' | 'outOfStock';
  available: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}
