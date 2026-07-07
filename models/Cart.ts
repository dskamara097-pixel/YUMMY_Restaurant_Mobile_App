export interface CartItemModel {
  foodId: string;
  restaurantId: string;
  restaurantName?: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
}

export interface CartModel {
  id: string;
  customerId: string;
  restaurantId?: string;
  items: CartItemModel[];
  subtotal: number;
  updatedAt: string;
}


