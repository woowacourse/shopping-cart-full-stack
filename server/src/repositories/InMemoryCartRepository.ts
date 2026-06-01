import { CartItemData } from "./CartItem";
import { CartRepositoryInterface } from "./interfaces/CartRepositoryInterface";
import { validateQuantity } from "./util/Validator";

export default class InMemoryCartRepository implements CartRepositoryInterface {
  #cart: Map<number, CartItemData>;
  #nextId: number;

  constructor() {
    this.#cart = new Map();
    this.#nextId = 1;
  }

  findById(cartItemId: number): CartItemData | null {
    return this.#cart.get(cartItemId) ?? null;
  }

  getCartProducts(): CartItemData[] {
    return [...this.#cart.values()];
  }

  addProductToCart(productId: number, quantity: number): CartItemData {
    validateQuantity(quantity);
    const cartItem = { productId, quantity, cartItemId: this.#nextId };
    this.#cart.set(this.#nextId, cartItem);
    this.#nextId++;
    return cartItem;
  }

  changeQuantity(cartItemId: number, newQuantity: number): CartItemData | null {
    validateQuantity(newQuantity);
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
      .filter(([_, cartItemData]) => cartItemData.productId === productId)
      .forEach(([cartItemId]) => this.#cart.delete(cartItemId));
  }
}
