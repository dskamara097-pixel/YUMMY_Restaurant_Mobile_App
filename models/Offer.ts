export interface OfferModel {
  id: string;
  title: string;
  description: string;
  badgeLabel?: string;
  restaurantId?: string;
  restaurantName?: string;
  discountLabel: string;
  expiresAt: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}
