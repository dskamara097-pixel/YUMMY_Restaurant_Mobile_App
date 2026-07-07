export interface CouponModel {
  id: string;
  restaurantId?: string;
  restaurantName?: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderAmount?: number;
  expiresAt: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}
