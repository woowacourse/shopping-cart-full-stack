import { CartItem } from "../types";

export interface CartRepository {
  getCarts(): CartItem[];
  deleteCart(productId: string): string;
  getCartItemByProductId(productId: string): CartItem | undefined;
  updateCartQuantity(productId: string, quantity: number): CartItem | undefined;
}

export class InMemoryCartRepository {
  private cartDB = new Map<string, CartItem>();

  constructor() {
    const seedCartItems: CartItem[] = [
      {
        product: {
          id: "0",
          name: "스타벅스 아메리카노",
          price: 4500,
          image:
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
        },
        quantity: 2,
      },
      {
        product: {
          id: "1",
          name: "블루보틀 라떼",
          price: 6000,
          image:
            "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=300",
        },
        quantity: 1,
      },
      {
        product: {
          id: "3",
          name: "투썸 케이크",
          price: 75000,
          image:
            "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300",
        },
        quantity: 1,
      },
    ];

    seedCartItems.forEach((cartItem) =>
      this.cartDB.set(cartItem.product.id, cartItem),
    );
  }

  getCarts() {
    const carts = [...this.cartDB.values()];

    return carts;
  }

  deleteCart(productId: string) {
    this.cartDB.delete(productId);

    return productId;
  }

  getCartItemByProductId(productId: string) {
    return this.cartDB.get(productId);
  }

  updateCartQuantity(productId: string, quantity: number) {
    const cartItem = this.cartDB.get(productId);

    if (!cartItem) return undefined;

    cartItem.quantity = quantity;
    return cartItem;
  }

  addCartItem(productId: string, cartItem: CartItem) {
    this.cartDB.set(productId, cartItem);
  }

  clear() {
    this.cartDB.clear();
  }
}
