export interface VendorModel {
  id: string;
  userId: string;
  restaurantId?: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  logo?: string;
  coverImage?: string;
  isOpen: boolean;
  verified: boolean;
  rating: number;
  totalOrders: number;
  openingHours?: string;
  closingHours?: string;
  createdAt: string;
  updatedAt?: string;
}
