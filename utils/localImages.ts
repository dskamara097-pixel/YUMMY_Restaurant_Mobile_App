import { ImageSourcePropType } from 'react-native';

export const restaurantLogoImage = require('../assets/images/logos/restaurant-logo.png') as ImageSourcePropType;
export const restaurantCoverImage = require('../assets/images/restaurants/restaurant-cover.png') as ImageSourcePropType;

const foodImages: Record<string, ImageSourcePropType> = {
  'alfredo-pasta': require('../assets/images/foods/alfredo-pasta.jpg'),
  burger: require('../assets/images/foods/burger.jpg'),
  'fried-rice': require('../assets/images/foods/fried-rice.jpg'),
  'grilled-chicken': require('../assets/images/foods/grilled-chicken.jpg'),
  'grilled-fish': require('../assets/images/foods/grilled-fish.jpg'),
  'ice-cream': require('../assets/images/foods/ice-cream.jpg'),
  'jollof-rice': require('../assets/images/foods/jollof-rice.jpg'),
  'mango-parfait': require('../assets/images/foods/mango-parfait.jpg'),
  milkshake: require('../assets/images/foods/milkshake.jpg'),
  'orange-juice': require('../assets/images/foods/orange-juice.jpg'),
  pizza: require('../assets/images/foods/pizza.jpg'),
  shawarma: require('../assets/images/foods/shawarma.jpg'),
};

const foodAliases: Record<string, string> = {
  'palace-margherita': 'pizza',
  'pepperoni-feast': 'pizza',
  'hub-classic-burger': 'burger',
  'crispy-chicken-burger': 'burger',
  'jollof-rice-bowl': 'jollof-rice',
  'grilled-sea-bass': 'grilled-fish',
  'creamy-alfredo': 'alfredo-pasta',
  'chicken-alfredo': 'alfredo-pasta',
  'alfredo-pasta': 'alfredo-pasta',
  'jollof-rice': 'jollof-rice',
  'grilled-fish': 'grilled-fish',
  'grilled-chicken': 'grilled-chicken',
  'fried-rice': 'fried-rice',
  'ice-cream': 'ice-cream',
  'mango-parfait': 'mango-parfait',
  'orange-juice': 'orange-juice',
};

function normalizeImageKey(value?: string) {
  return String(value ?? '')
    .replace(/^placeholder:\/\//, '')
    .replace(/\.(jpg|jpeg|png|webp)$/i, '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function remoteImageSource(value?: string): ImageSourcePropType | null {
  if (!value || value.startsWith('placeholder://')) return null;
  if (/^https?:\/\//i.test(value) || /^file:/i.test(value)) return { uri: value };
  return null;
}

export function getFoodImageSource(value?: string): ImageSourcePropType {
  const remoteSource = remoteImageSource(value);
  if (remoteSource) return remoteSource;

  const key = normalizeImageKey(value);
  const alias = foodAliases[key] ?? key;

  if (foodImages[alias]) return foodImages[alias];
  if (key.includes('burger')) return foodImages.burger;
  if (key.includes('pizza')) return foodImages.pizza;
  if (key.includes('jollof')) return foodImages['jollof-rice'];
  if (key.includes('fried-rice')) return foodImages['fried-rice'];
  if (key.includes('fish') || key.includes('sea-bass')) return foodImages['grilled-fish'];
  if (key.includes('chicken')) return foodImages['grilled-chicken'];
  if (key.includes('alfredo') || key.includes('pasta')) return foodImages['alfredo-pasta'];
  if (key.includes('parfait') || key.includes('mango')) return foodImages['mango-parfait'];
  if (key.includes('milkshake')) return foodImages.milkshake;
  if (key.includes('orange') || key.includes('juice')) return foodImages['orange-juice'];
  if (key.includes('ice')) return foodImages['ice-cream'];
  if (key.includes('shawarma')) return foodImages.shawarma;

  return foodImages['jollof-rice'];
}

export function getRestaurantLogoSource(value?: string): ImageSourcePropType {
  return remoteImageSource(value) ?? restaurantLogoImage;
}

export function getRestaurantCoverSource(value?: string): ImageSourcePropType {
  return remoteImageSource(value) ?? restaurantCoverImage;
}

export function getLocalFoodPlaceholder(name: string) {
  return `placeholder://${normalizeImageKey(name)}`;
}

