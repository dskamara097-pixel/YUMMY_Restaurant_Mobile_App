export const FIREBASE_ROLES = {
  customer: 'customer',
  vendor: 'vendor',
  admin: 'admin',
  rider: 'rider',
} as const;

export type FirebaseRole = (typeof FIREBASE_ROLES)[keyof typeof FIREBASE_ROLES];

export const ROLE_DESCRIPTIONS: Record<FirebaseRole, string> = {
  customer: 'Can browse restaurants, manage carts, place orders, and review orders.',
  vendor: 'Can manage their own restaurant profile, menu, offers, coupons, and incoming orders.',
  admin: 'Can administer platform data and operational workflows in future phases.',
  rider: 'Can view assigned deliveries and delivery timeline updates in future phases.',
};
