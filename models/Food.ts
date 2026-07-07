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
  available: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}
