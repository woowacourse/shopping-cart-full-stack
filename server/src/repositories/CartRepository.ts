import { StoredCartItem } from "./CartItem";
export default class CartRepository {
  #cart: Map<number, StoredCartItem>;
  #nextId: number;

  constructor() {
    this.#cart = new Map();
    this.#nextId = 1;
  }

  findById(cartItemId: number): StoredCartItem | null {
    return this.#cart.get(cartItemId) ?? null;
  }

  getCartProducts(): StoredCartItem[] {
    return [...this.#cart.values()];
  }

  addProductToCart(productId: number, quantity: number): StoredCartItem {
    const cartItem = {
      cartItemId: this.#nextId,
      quantity,
      productId,
    };
    this.#cart.set(this.#nextId, cartItem);
    this.#nextId++;
    return cartItem;
  }

  changeQuantity(
    cartItemId: number,
    newQuantity: number,
  ): StoredCartItem | null {
    const cartItem = this.#cart.get(cartItemId);
    if (!cartItem) return null;

    const newItem = { ...cartItem, quantity: newQuantity };
    this.#cart.set(cartItemId, newItem);

    return newItem;
  }

  deleteByCartId(cartItemId: number): void {
    this.#cart.delete(cartItemId);
  }

  deleteByProductId(productId: number): void {
    [...this.#cart.entries()]
      .filter(([_, StoredCartItem]) => StoredCartItem.productId === productId)
      .forEach(([cartItemId]) => this.#cart.delete(cartItemId));
  }

  clear(): void {
    this.#cart.clear();
    this.#nextId = 1;
  }
}

export const cartRepository = new CartRepository();
