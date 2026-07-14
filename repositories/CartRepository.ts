import { CartItemModel, CartModel } from '@/models';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

function calculateSubtotal(items: CartItemModel[]) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

function normalizeItems(items: CartItemModel[]) {
  return items.map((item) => {
    const quantity = Math.max(1, item.quantity);
    const nextItem: CartItemModel = {
      foodId: item.foodId,
      restaurantId: item.restaurantId,
      name: item.name,
      unitPrice: item.unitPrice,
      quantity,
      lineTotal: item.unitPrice * quantity,
    };

    if (item.restaurantName) {
      nextItem.restaurantName = item.restaurantName;
    }

    if (item.imageUrl) {
      nextItem.imageUrl = item.imageUrl;
    }

    return nextItem;
  });
}

function createCartData(customerId: string, items: CartItemModel[]): Omit<CartModel, 'id'> {
  const nextItems = normalizeItems(items);
  const timestamp = new Date().toISOString();
  const cartData: Omit<CartModel, 'id'> = {
    customerId,
    items: nextItems,
    subtotal: calculateSubtotal(nextItems),
    updatedAt: timestamp,
  };

  if (nextItems[0]?.restaurantId) {
    cartData.restaurantId = nextItems[0].restaurantId;
  }

  return cartData;
}

export class CartRepository extends FirestoreRepository<CartModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.carts);
  }

  async getActiveCartForCustomer(customerId: string): Promise<CartModel | null> {
    return this.getById(customerId);
  }

  async saveActiveCart(customerId: string, items: CartItemModel[]) {
    return this.create({
      id: customerId,
      ...createCartData(customerId, items),
    });
  }

  async addItem(customerId: string, item: CartItemModel) {
    const currentCart = await this.getActiveCartForCustomer(customerId);
    const currentItems = currentCart?.items ?? [];
    const existingItem = currentItems.find((cartItem) => cartItem.foodId === item.foodId);
    const nextItems = existingItem
      ? currentItems.map((cartItem) => (cartItem.foodId === item.foodId ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem))
      : [...currentItems, item];

    return this.saveActiveCart(customerId, nextItems);
  }

  async updateQuantity(customerId: string, foodId: string, quantity: number) {
    const currentCart = await this.getActiveCartForCustomer(customerId);
    const nextQuantity = Math.max(1, quantity);
    const nextItems = (currentCart?.items ?? []).map((item) => (item.foodId === foodId ? { ...item, quantity: nextQuantity } : item));
    return this.saveActiveCart(customerId, nextItems);
  }

  async removeItem(customerId: string, foodId: string) {
    const currentCart = await this.getActiveCartForCustomer(customerId);
    const nextItems = (currentCart?.items ?? []).filter((item) => item.foodId !== foodId);
    return this.saveActiveCart(customerId, nextItems);
  }

  async clearActiveCart(customerId: string) {
    return this.saveActiveCart(customerId, []);
  }
}

export const cartRepository = new CartRepository();
