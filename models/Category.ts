export interface CategoryModel {
  id: string;
  restaurantId?: string;
  name: string;
  description?: string;
  iconName?: string;
  imageUrl?: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
}
