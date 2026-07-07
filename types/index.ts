export type UserRole = 'customer' | 'admin';

export type FoodCategory =
  | 'Pizza'
  | 'Burgers'
  | 'Rice'
  | 'Drinks'
  | 'Desserts'
  | 'Seafood'
  | 'Italian'
  | 'Local';

export type OrderStatus =
  | 'Pending'
  | 'Payment Received'
  | 'Preparing'
  | 'Ready'
  | 'Delivered';

export type PaymentMethod = 'Mobile Money' | 'Dummy Credit Card';

export type PaymentStatus = 'Submitted' | 'Approved' | 'Rejected';

export interface User {
  id: string;
  fullName: string;
  address: string;
  phone: string;
  username: string;
  role: 'customer';
  createdAt: string;
  updatedAt?: string;
}

export interface Admin {
  id: string;
  fullName: string;
  username: string;
  role: 'admin';
  createdAt: string;
  updatedAt?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category: FoodCategory;
  description: string;
  logoUrl: string;
  coverImageUrl: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  distance: string;
  deliveryFee: number;
  featured: boolean;
  popular: boolean;
  offerLabel?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FoodItem {
  id: string;
  restaurantId?: string;
  restaurantName?: string;
  name: string;
  category: FoodCategory;
  description: string;
  price: number;
  currency: 'SLE';
  imageUrl: string;
  availability: boolean;
  featured: boolean;
  popular: boolean;
  recommended?: boolean;
  rating?: number;
  deliveryTime?: string;
  ingredients?: string[];
  nutritionNote?: string;
  offerLabel?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  foodId: string;
  foodName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: CartItem[];
  quantity: number;
  amount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'Unpaid' | PaymentStatus;
  confirmed: boolean;
  createdAt: string;
  updatedAt?: string;
  confirmedAt?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  mobileNumber?: string;
  network?: string;
  cardHolderName?: string;
  cardNumberLast4?: string;
  expiryDate?: string;
  cvv?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  orderId?: string;
  title: string;
  message: string;
  type: 'payment' | 'order' | 'system';
  read: boolean;
  createdAt: string;
}
