export type RestaurantStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface RestaurantModel {
  id: string;
  ownerId?: string;
  name: string;
  description: string;
  categoryIds: string[];
  logoUrl?: string;
  coverImageUrl?: string;
  rating: number;
  reviewsCount: number;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  active: boolean;
  status?: RestaurantStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}
