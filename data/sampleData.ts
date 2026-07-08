import type { AppIconName } from '@/constants/theme';
import { Admin, FoodCategory, FoodItem, Notification, Order, Payment, Restaurant, User } from '@/types';

export type BrowsingCategory = {
  id: string;
  title: string;
  subtitle: string;
  icon: AppIconName;
  filter?: FoodCategory;
};

export type SpecialOffer = {
  id: string;
  title: string;
  description: string;
  restaurantId: string;
  foodId?: string;
  label: string;
};

export const sampleUsers: User[] = [
  {
    id: 'sample-user-001',
    fullName: 'Sample Customer',
    address: 'Freetown, Sierra Leone',
    phone: '+23276000000',
    username: 'customer',
    role: 'customer',
    createdAt: '2026-07-05T00:00:00.000Z',
  },
];

export const sampleAdmins: Admin[] = [
  {
    id: 'sample-admin-001',
    fullName: 'YUMMY Administrator',
    username: 'admin',
    role: 'admin',
    createdAt: '2026-07-05T00:00:00.000Z',
  },
];

export const browsingCategories: BrowsingCategory[] = [
  { id: 'all', title: 'All', subtitle: 'Every craving', icon: 'grid-outline' },
  { id: 'pizza', title: 'Pizza', subtitle: 'Oven fresh', icon: 'pizza-outline', filter: 'Pizza' },
  { id: 'burgers', title: 'Burgers', subtitle: 'Juicy stacks', icon: 'fast-food-outline', filter: 'Burgers' },
  { id: 'rice', title: 'Rice', subtitle: 'Local plates', icon: 'restaurant-outline', filter: 'Rice' },
  { id: 'seafood', title: 'Seafood', subtitle: 'Coastal flavor', icon: 'fish-outline', filter: 'Seafood' },
  { id: 'italian', title: 'Italian', subtitle: 'Pasta and more', icon: 'wine-outline', filter: 'Italian' },
  { id: 'desserts', title: 'Desserts', subtitle: 'Sweet finish', icon: 'ice-cream-outline', filter: 'Desserts' },
  { id: 'drinks', title: 'Drinks', subtitle: 'Cool refreshers', icon: 'cafe-outline', filter: 'Drinks' },
];

export const sampleRestaurants: Restaurant[] = [
  {
    id: 'restaurant-yummy-kitchen',
    name: 'YUMMY Kitchen',
    category: 'Local',
    description: 'Taste the tradition. Love every bite.',
    logoUrl: 'placeholder://restaurant-logo',
    coverImageUrl: 'placeholder://restaurant-cover',
    rating: 4.9,
    reviewsCount: 510,
    deliveryTime: '30-40 min',
    distance: '2.6 km',
    deliveryFee: 20,
    featured: true,
    popular: true,
    offerLabel: 'Taste the tradition',
    createdAt: '2026-07-05T00:00:00.000Z',
  },
];
export const sampleFoods: FoodItem[] = [
  {
    id: 'food-palace-margherita',
    restaurantId: 'restaurant-yummy-kitchen',
    restaurantName: 'YUMMY Kitchen',
    name: 'Palace Margherita Pizza',
    category: 'Pizza',
    description: 'Classic tomato, mozzarella, basil, and extra virgin olive oil on a crisp stone-baked base.',
    price: 260,
    currency: 'SLE',
    imageUrl: 'placeholder://palace-margherita',
    availability: true,
    featured: true,
    popular: true,
    recommended: true,
    rating: 4.8,
    deliveryTime: '25-35 min',
    ingredients: ['Mozzarella', 'Tomato sauce', 'Fresh basil', 'Olive oil'],
    nutritionNote: 'Nutrition details will be finalized when restaurant data is connected.',
    offerLabel: 'Best seller',
    createdAt: '2026-07-05T00:00:00.000Z',
  },
  {
    id: 'food-pepperoni-feast',
    restaurantId: 'restaurant-yummy-kitchen',
    restaurantName: 'YUMMY Kitchen',
    name: 'Pepperoni Feast',
    category: 'Pizza',
    description: 'Loaded pepperoni pizza with melted cheese and a rich house tomato sauce.',
    price: 310,
    currency: 'SLE',
    imageUrl: 'placeholder://pepperoni-feast',
    availability: true,
    featured: false,
    popular: true,
    recommended: false,
    rating: 4.7,
    deliveryTime: '25-35 min',
    ingredients: ['Pepperoni', 'Mozzarella', 'Tomato sauce', 'Oregano'],
    nutritionNote: 'Nutrition placeholder for calories, protein, and allergens.',
    createdAt: '2026-07-05T00:00:00.000Z',
  },
  {
    id: 'food-hub-classic-burger',
    restaurantId: 'restaurant-yummy-kitchen',
    restaurantName: 'YUMMY Kitchen',
    name: 'Hub Classic Burger',
    category: 'Burgers',
    description: 'Grilled beef patty, cheddar, lettuce, tomato, pickles, and signature house sauce.',
    price: 185,
    currency: 'SLE',
    imageUrl: 'placeholder://hub-classic-burger',
    availability: true,
    featured: true,
    popular: true,
    recommended: true,
    rating: 4.7,
    deliveryTime: '20-30 min',
    ingredients: ['Beef patty', 'Cheddar', 'Lettuce', 'Tomato', 'House sauce'],
    nutritionNote: 'Nutrition placeholder for future restaurant entry.',
    offerLabel: 'Combo available',
    createdAt: '2026-07-05T00:00:00.000Z',
  },
  {
    id: 'food-crispy-chicken-burger',
    restaurantId: 'restaurant-yummy-kitchen',
    restaurantName: 'YUMMY Kitchen',
    name: 'Crispy Chicken Burger',
    category: 'Burgers',
    description: 'Golden crispy chicken fillet with slaw, spicy mayo, and soft brioche bun.',
    price: 170,
    currency: 'SLE',
    imageUrl: 'placeholder://crispy-chicken-burger',
    availability: true,
    featured: false,
    popular: true,
    recommended: false,
    rating: 4.6,
    deliveryTime: '20-30 min',
    ingredients: ['Chicken fillet', 'Slaw', 'Spicy mayo', 'Brioche bun'],
    nutritionNote: 'Nutrition placeholder for future data connection.',
    createdAt: '2026-07-05T00:00:00.000Z',
  },
  {
    id: 'food-jollof-rice-bowl',
    restaurantId: 'restaurant-yummy-kitchen',
    restaurantName: 'YUMMY Kitchen',
    name: 'Jollof Rice Bowl',
    category: 'Rice',
    description: 'Smoky jollof rice served with grilled chicken, plantain, and fresh pepper sauce.',
    price: 195,
    currency: 'SLE',
    imageUrl: 'placeholder://jollof-rice-bowl',
    availability: true,
    featured: true,
    popular: true,
    recommended: true,
    rating: 4.9,
    deliveryTime: '30-40 min',
    ingredients: ['Jollof rice', 'Grilled chicken', 'Plantain', 'Pepper sauce'],
    nutritionNote: 'Nutrition placeholder for rice, protein, and spice level.',
    offerLabel: 'Chef pick',
    createdAt: '2026-07-05T00:00:00.000Z',
  },
  {
    id: 'food-grilled-sea-bass',
    restaurantId: 'restaurant-yummy-kitchen',
    restaurantName: 'YUMMY Kitchen',
    name: 'Grilled Sea Bass',
    category: 'Seafood',
    description: 'Charcoal-grilled fish with lemon herb sauce, salad, and seasoned rice.',
    price: 340,
    currency: 'SLE',
    imageUrl: 'placeholder://grilled-sea-bass',
    availability: true,
    featured: false,
    popular: true,
    recommended: true,
    rating: 4.6,
    deliveryTime: '35-45 min',
    ingredients: ['Sea bass', 'Lemon herb sauce', 'Salad', 'Seasoned rice'],
    nutritionNote: 'Nutrition placeholder for seafood allergens and protein.',
    createdAt: '2026-07-05T00:00:00.000Z',
  },
  {
    id: 'food-creamy-alfredo',
    restaurantId: 'restaurant-yummy-kitchen',
    restaurantName: 'YUMMY Kitchen',
    name: 'Creamy Alfredo Pasta',
    category: 'Italian',
    description: 'Fettuccine tossed in creamy parmesan sauce with grilled chicken and herbs.',
    price: 230,
    currency: 'SLE',
    imageUrl: 'placeholder://creamy-alfredo',
    availability: true,
    featured: true,
    popular: false,
    recommended: true,
    rating: 4.5,
    deliveryTime: '25-40 min',
    ingredients: ['Fettuccine', 'Parmesan sauce', 'Grilled chicken', 'Parsley'],
    nutritionNote: 'Nutrition placeholder for dairy and calories.',
    offerLabel: 'Dinner favorite',
    createdAt: '2026-07-05T00:00:00.000Z',
  },
  {
    id: 'food-mango-parfait',
    restaurantId: 'restaurant-yummy-kitchen',
    restaurantName: 'YUMMY Kitchen',
    name: 'Mango Cream Parfait',
    category: 'Desserts',
    description: 'Chilled mango cream layered with biscuit crumble and fresh fruit.',
    price: 95,
    currency: 'SLE',
    imageUrl: 'placeholder://mango-parfait',
    availability: true,
    featured: false,
    popular: false,
    recommended: true,
    rating: 4.4,
    deliveryTime: '30-40 min',
    ingredients: ['Mango', 'Cream', 'Biscuit crumble', 'Fresh fruit'],
    nutritionNote: 'Nutrition placeholder for sugar and dairy notes.',
    createdAt: '2026-07-05T00:00:00.000Z',
  },
];

export const sampleSpecialOffers: SpecialOffer[] = [
  {
    id: 'offer-yummy-lunch',
    title: 'YUMMY Lunch Saver',
    description: 'Featured bowls and drinks bundled for a faster lunch break.',
    restaurantId: 'restaurant-yummy-kitchen',
    foodId: 'food-jollof-rice-bowl',
    label: 'From SLE 150',
  },
  {
    id: 'offer-pizza-family',
    title: 'YUMMY Kitchen Family Deal',
    description: 'Shareable pizza combinations with a free chilled drink placeholder.',
    restaurantId: 'restaurant-yummy-kitchen',
    foodId: 'food-palace-margherita',
    label: 'Limited offer',
  },
  {
    id: 'offer-burger-double',
    title: 'YUMMY Kitchen Double Bite',
    description: 'A UI-only promo for double burger meals and crispy sides.',
    restaurantId: 'restaurant-yummy-kitchen',
    foodId: 'food-hub-classic-burger',
    label: '15% off',
  },
];

export const recentSearches = ['Jollof rice', 'YUMMY Kitchen', 'Chicken burger'];

export const popularSearches = ['Seafood', 'Best rated', 'Fast delivery', 'Desserts'];

export const sampleOrders: Order[] = [];

export const samplePayments: Payment[] = [];

export const sampleNotifications: Notification[] = [];

export type SampleCartItem = {
  id: string;
  foodId: string;
  foodName: string;
  restaurantName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
};

export type SampleDeliveryAddress = {
  customerName: string;
  phone: string;
  address: string;
};

export const sampleCartItems: SampleCartItem[] = [
  {
    id: 'cart-jollof-rice-bowl',
    foodId: 'food-jollof-rice-bowl',
    foodName: 'Jollof Rice Bowl',
    restaurantName: 'YUMMY Kitchen',
    imageUrl: 'placeholder://jollof-rice-bowl',
    unitPrice: 195,
    quantity: 2,
  },
  {
    id: 'cart-hub-classic-burger',
    foodId: 'food-hub-classic-burger',
    foodName: 'Hub Classic Burger',
    restaurantName: 'YUMMY Kitchen',
    imageUrl: 'placeholder://hub-classic-burger',
    unitPrice: 185,
    quantity: 1,
  },
  {
    id: 'cart-mango-parfait',
    foodId: 'food-mango-parfait',
    foodName: 'Mango Cream Parfait',
    restaurantName: 'YUMMY Kitchen',
    imageUrl: 'placeholder://mango-parfait',
    unitPrice: 95,
    quantity: 1,
  },
];

export const sampleDeliveryAddress: SampleDeliveryAddress = {
  customerName: 'Sample Customer',
  phone: '+232 76 000 000',
  address: '15 Lumley Beach Road, Freetown, Sierra Leone',
};

export const sampleOrderFees = {
  deliveryFee: 20,
  serviceFee: 12,
  discount: 25,
  estimatedDeliveryTime: '35-45 min',
  paymentMethodLabel: 'Payment method will be selected in the dummy payment phase',
} as const;

export type SampleUserProfile = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
};

export type SamplePreviousOrder = {
  id: string;
  restaurantName: string;
  foodItems: string[];
  orderDate: string;
  totalAmount: number;
  status: 'Order Confirmed' | 'Payment Received' | 'Preparing' | 'Ready' | 'Delivered';
  estimatedDeliveryTime: string;
  deliveryAddress: string;
};

export type SampleRider = {
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
};

export type SampleTrackingStep = {
  label: string;
  description: string;
};

export type SampleCustomerNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'payment' | 'order' | 'system';
  read: boolean;
  orderId?: string;
};

export type SampleSavedAddress = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  address: string;
  isDefault: boolean;
};

export type SampleFaq = {
  id: string;
  question: string;
  answer: string;
};

export const sampleUserProfile: SampleUserProfile = {
  fullName: 'David Saio Kamara',
  phone: '+232 76 000 000',
  email: 'customer@yummy.local',
  address: '15 Lumley Beach Road, Freetown, Sierra Leone',
};

export const samplePreviousOrders: SamplePreviousOrder[] = [
  {
    id: 'YUM-1048',
    restaurantName: 'YUMMY Kitchen',
    foodItems: ['Jollof Rice Bowl', 'Mango Cream Parfait'],
    orderDate: 'July 5, 2026',
    totalAmount: 510,
    status: 'Preparing',
    estimatedDeliveryTime: '18 min',
    deliveryAddress: sampleUserProfile.address,
  },
  {
    id: 'YUM-1039',
    restaurantName: 'YUMMY Kitchen',
    foodItems: ['Palace Margherita Pizza', 'Pepperoni Feast'],
    orderDate: 'July 2, 2026',
    totalAmount: 620,
    status: 'Delivered',
    estimatedDeliveryTime: 'Delivered',
    deliveryAddress: '22 Wilkinson Road, Freetown, Sierra Leone',
  },
  {
    id: 'YUM-1026',
    restaurantName: 'YUMMY Kitchen',
    foodItems: ['Hub Classic Burger', 'Crispy Chicken Burger'],
    orderDate: 'June 28, 2026',
    totalAmount: 390,
    status: 'Delivered',
    estimatedDeliveryTime: 'Delivered',
    deliveryAddress: sampleUserProfile.address,
  },
];

export const sampleRider: SampleRider = {
  name: 'Mohamed Conteh',
  phone: '+232 77 222 333',
  rating: 4.8,
  vehicle: 'Motorbike SL-428',
};

export const sampleTrackingSteps: SampleTrackingStep[] = [
  { label: 'Order Confirmed', description: 'Your order has been received by YUMMY.' },
  { label: 'Payment Received', description: 'Dummy payment status is shown as approved for this UI preview.' },
  { label: 'Preparing', description: 'The restaurant is preparing your meals.' },
  { label: 'Ready', description: 'Your order will be handed to the rider soon.' },
  { label: 'Delivered', description: 'Your order has arrived.' },
];

export const sampleCustomerNotifications: SampleCustomerNotification[] = [
  {
    id: 'notification-payment-approved',
    title: 'Payment approved',
    message: 'Your dummy payment for order YUM-1048 has been approved.',
    time: '5 min ago',
    type: 'payment',
    read: false,
    orderId: 'YUM-1048',
  },
  {
    id: 'notification-order-preparing',
    title: 'Order preparing',
    message: 'YUMMY Kitchen is preparing your Jollof Rice Bowl.',
    time: '12 min ago',
    type: 'order',
    read: false,
    orderId: 'YUM-1048',
  },
  {
    id: 'notification-order-delivered',
    title: 'Order delivered',
    message: 'Your YUMMY Kitchen order was delivered successfully.',
    time: '3 days ago',
    type: 'order',
    read: true,
    orderId: 'YUM-1039',
  },
];

export const sampleSavedAddresses: SampleSavedAddress[] = [
  {
    id: 'address-home',
    label: 'Home',
    recipient: sampleUserProfile.fullName,
    phone: sampleUserProfile.phone,
    address: sampleUserProfile.address,
    isDefault: true,
  },
  {
    id: 'address-campus',
    label: 'Campus',
    recipient: sampleUserProfile.fullName,
    phone: '+232 78 555 111',
    address: 'Njala University campus gate, Freetown, Sierra Leone',
    isDefault: false,
  },
  {
    id: 'address-office',
    label: 'Office',
    recipient: 'D. S. Kamara',
    phone: sampleUserProfile.phone,
    address: 'Siaka Stevens Street, Freetown, Sierra Leone',
    isDefault: false,
  },
];

export const sampleFaqs: SampleFaq[] = [
  {
    id: 'faq-order-status',
    question: 'How do I check my order status?',
    answer: 'Open Order History and select an order to view the professional delivery timeline.',
  },
  {
    id: 'faq-payment',
    question: 'Are payments real in this app?',
    answer: 'No. Payments are dummy placeholders for the assignment and will not process real money.',
  },
  {
    id: 'faq-address',
    question: 'Can I save multiple addresses?',
    answer: 'The UI supports saved addresses. Real storage will be added only in an approved backend phase.',
  },
];

export type SampleReview = {
  id: string;
  targetId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpfulCount: number;
  imageCount?: number;
};

export type SampleCoupon = {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  expiryDate: string;
  restaurantName?: string;
};

export type SampleOffer = {
  id: string;
  title: string;
  description: string;
  label: string;
  restaurantName: string;
  expiresIn: string;
  featured?: boolean;
};

export type SampleRecentlyViewed = {
  restaurants: string[];
  foods: string[];
};

export type SampleSearchFilter = {
  id: string;
  label: string;
  values: string[];
};

export const sampleRestaurantReviews: SampleReview[] = [
  {
    id: 'review-restaurant-yummy-1',
    targetId: 'restaurant-yummy-kitchen',
    customerName: 'Aminata Conteh',
    rating: 5,
    title: 'Fresh and fast',
    comment: 'The jollof bowl arrived hot, neatly packed, and full of flavor. The rider was polite too.',
    date: 'July 4, 2026',
    helpfulCount: 34,
  },
  {
    id: 'review-restaurant-yummy-2',
    targetId: 'restaurant-yummy-kitchen',
    customerName: 'Ibrahim Bangura',
    rating: 4.5,
    title: 'Reliable lunch spot',
    comment: 'Good portions and consistent delivery time. I would like more spicy options later.',
    date: 'July 1, 2026',
    helpfulCount: 18,
  },
  {
    id: 'review-restaurant-pizza-1',
    targetId: 'restaurant-yummy-kitchen',
    customerName: 'Mabinty Kamara',
    rating: 4.8,
    title: 'Great family deal',
    comment: 'The pizza combo felt premium and the cheese was generous. Nice UI preview for reviews.',
    date: 'June 29, 2026',
    helpfulCount: 21,
  },
];

export const sampleFoodReviews: SampleReview[] = [
  {
    id: 'review-food-jollof-1',
    targetId: 'food-jollof-rice-bowl',
    customerName: 'Samuel Kargbo',
    rating: 4.9,
    title: 'Best jollof bowl',
    comment: 'Smoky rice, soft plantain, and the chicken had a nice char. I would order again.',
    date: 'July 5, 2026',
    helpfulCount: 42,
    imageCount: 3,
  },
  {
    id: 'review-food-burger-1',
    targetId: 'food-hub-classic-burger',
    customerName: 'Fatmata Sesay',
    rating: 4.7,
    title: 'Juicy burger',
    comment: 'The sauce was excellent and the bun stayed soft during delivery.',
    date: 'July 3, 2026',
    helpfulCount: 16,
    imageCount: 2,
  },
  {
    id: 'review-food-pizza-1',
    targetId: 'food-palace-margherita',
    customerName: 'David Mansaray',
    rating: 4.6,
    title: 'Classic taste',
    comment: 'Simple, cheesy, and satisfying. A stronger basil flavor would make it perfect.',
    date: 'June 30, 2026',
    helpfulCount: 12,
    imageCount: 1,
  },
];

export const sampleCoupons: SampleCoupon[] = [
  {
    id: 'coupon-yummy10',
    code: 'YUMMY10',
    title: 'First Bite Discount',
    description: 'Save on your next UI-only order preview.',
    discount: '10% off',
    expiryDate: 'July 31, 2026',
  },
  {
    id: 'coupon-lunch150',
    code: 'LUNCH150',
    title: 'Lunch Saver',
    description: 'Special lunch coupon for YUMMY Kitchen bowls.',
    discount: 'Le 25 off',
    expiryDate: 'July 20, 2026',
    restaurantName: 'YUMMY Kitchen',
  },
  {
    id: 'coupon-pizza-night',
    code: 'PIZZADEAL',
    title: 'Pizza Night',
    description: 'Static coupon for family pizza bundles.',
    discount: '15% off',
    expiryDate: 'August 5, 2026',
    restaurantName: 'YUMMY Kitchen',
  },
];

export const sampleEnhancedOffers: SampleOffer[] = [
  {
    id: 'offer-daily-jollof',
    title: 'Daily Jollof Deal',
    description: 'Jollof bowl, dessert, and drink combo for a warm weekday meal.',
    label: 'Daily deal',
    restaurantName: 'YUMMY Kitchen',
    expiresIn: 'Ends tonight',
    featured: true,
  },
  {
    id: 'offer-limited-burger',
    title: 'YUMMY Kitchen Double Stack',
    description: 'Limited UI-only promotion for double burgers and fries.',
    label: 'Limited offer',
    restaurantName: 'YUMMY Kitchen',
    expiresIn: '2 days left',
  },
  {
    id: 'offer-seafood-weekend',
    title: 'Weekend Seafood Plate',
    description: 'Restaurant promotion for grilled fish and seasonal sides.',
    label: 'Restaurant promo',
    restaurantName: 'YUMMY Kitchen',
    expiresIn: 'This weekend',
    featured: true,
  },
];

export const sampleRecentlyViewed: SampleRecentlyViewed = {
  restaurants: ['restaurant-yummy-kitchen', 'restaurant-yummy-kitchen', 'restaurant-yummy-kitchen'],
  foods: ['food-jollof-rice-bowl', 'food-hub-classic-burger', 'food-palace-margherita'],
};

export const sampleRecommendedRestaurantIds = ['restaurant-yummy-kitchen', 'restaurant-yummy-kitchen', 'restaurant-yummy-kitchen'];
export const sampleRecommendedFoodIds = ['food-jollof-rice-bowl', 'food-grilled-sea-bass', 'food-creamy-alfredo'];
export const sampleTrendingFoodIds = ['food-hub-classic-burger', 'food-palace-margherita', 'food-mango-parfait'];

export const sampleSearchFilters: SampleSearchFilter[] = [
  { id: 'cuisine', label: 'Cuisine', values: ['Local', 'Pizza', 'Burgers', 'Seafood', 'Italian'] },
  { id: 'price', label: 'Price', values: ['Budget', 'Mid-range', 'Premium'] },
  { id: 'distance', label: 'Distance', values: ['Nearby', 'Under 3 km', 'Any distance'] },
  { id: 'rating', label: 'Rating', values: ['4.0+', '4.5+', 'Top rated'] },
  { id: 'delivery-time', label: 'Delivery Time', values: ['Under 30 min', '30-45 min', 'Any time'] },
  { id: 'offers', label: 'Offers', values: ['Deals only', 'Coupons', 'Free delivery'] },
  { id: 'diet', label: 'Veg/Non-Veg', values: ['Vegetarian', 'Non-Veg', 'All'] },
];

export const sampleSearchSortOptions = [
  'Popularity',
  'Highest Rated',
  'Fastest Delivery',
  'Price Low to High',
  'Price High to Low',
  'Newest',
];

