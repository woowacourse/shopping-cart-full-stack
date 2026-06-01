import CartItem from "./CartItem.js";

export interface CartRepository {
  add: (productId: number, itemCount: number) => void;
  delete: (productId: number) => void;
  get: () => CartItem[];
  reset: () => void;
  updateItemCount: (productId: number, itemCount: number) => void;
  findByProductId: (productId: number) => CartItem | undefined;
}

export class InMemoryCartRepository implements CartRepository {
  private cart: Array<CartItem>;

  constructor() {
    this.cart = [];
  }

  add(productId: number, itemCount: number) {
    const newCartItem = new CartItem(productId, itemCount);
    this.cart.push(newCartItem);
  }

  findByProductId(productId: number) {
    return this.cart.find((cartItem) => cartItem.isSameProductId(productId));
  }

  delete(productId: number) {
    this.cart = this.cart.filter(
      (cartItem) => !cartItem.isSameProductId(productId),
    );
  }

  updateItemCount(productId: number, itemCount: number) {
    const cartItem = this.findByProductId(productId);

    cartItem?.updateItemCount(itemCount);
  }

  get() {
    return [...this.cart];
  }

  reset() {
    this.cart = [];
  }
}
