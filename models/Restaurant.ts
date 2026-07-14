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
  phone?: string;
  email?: string;
  address?: string;
  openingHours?: string;
  closingHours?: string;
  status?: RestaurantStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}
