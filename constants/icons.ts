import { Ionicons } from '@expo/vector-icons';

export type AppIconName = keyof typeof Ionicons.glyphMap;

export const icons = {
  add: 'add',
  alert: 'alert-circle-outline',
  arrowBack: 'arrow-back',
  bell: 'notifications-outline',
  cart: 'cart-outline',
  check: 'checkmark',
  chevronRight: 'chevron-forward',
  close: 'close',
  creditCard: 'card-outline',
  edit: 'create-outline',
  error: 'close-circle-outline',
  food: 'restaurant-outline',
  heart: 'heart-outline',
  home: 'home-outline',
  location: 'location-outline',
  lock: 'lock-closed-outline',
  menu: 'menu-outline',
  phone: 'call-outline',
  profile: 'person-outline',
  search: 'search',
  star: 'star',
  success: 'checkmark-circle-outline',
  trash: 'trash-outline',
  warning: 'warning-outline',
} satisfies Record<string, AppIconName>;