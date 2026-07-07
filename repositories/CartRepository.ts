import { CartItemModel, CartModel } from '@/models';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

function calculateSubtotal(items: CartItemModel[]) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

function normalizeItems(items: CartItemModel[]) {
  return items.map((item) => ({
    ...item,
    quantity: Math.max(1, item.quantity),
    lineTotal: item.unitPrice * Math.max(1, item.quantity),
  }));
}

export class CartRepository extends FirestoreRepository<CartModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.carts);
  }

  async getActiveCartForCustomer(customerId: string): Promise<CartModel | null> {
    const directCart = await this.getById(customerId);

    if (directCart) {
      return directCart;
    }

    const carts = await this.list({ filters: [{ field: 'customerId', value: customerId }], sort: [{ field: 'updatedAt', direction: 'desc' }], pageSize: 1 });
    return carts[0] ?? null;
  }

  async saveActiveCart(customerId: string, items: CartItemModel[]) {
    const nextItems = normalizeItems(items);
    const restaurantId = nextItems[0]?.restaurantId;

    return this.create({
      id: customerId,
      customerId,
      restaurantId,
      items: nextItems,
      subtotal: calculateSubtotal(nextItems),
      updatedAt: new Date().toISOString(),
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
