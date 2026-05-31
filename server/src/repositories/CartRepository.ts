import { StoredCartItem } from "./CartItem";
import { validateQuantity } from "./util/Validator";

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
    validateQuantity(quantity);
    const cartItem = {
      cartItemId: this.#nextId,
      quantity,
      productId,
    };
    this.#cart.set(this.#nextId, cartItem);
    this.#nextId++;
    return cartItem;
  }

  // `changeQuantity()` 장바구니 수량 변경
  changeQuantity(
    cartItemId: number,
    newQuantity: number,
  ): StoredCartItem | null {
    validateQuantity(newQuantity);
    // cartItemId를 찾아서
    const cartItem = this.#cart.get(cartItemId);
    if (!cartItem) return null;
    // newQuantity로 업데이트
    const newItem = { ...cartItem, quantity: newQuantity };
    this.#cart.set(cartItemId, newItem);

    return newItem;
  }

  // ` deleteByCartId()` 장바구니 목록 제거
  deleteByCartId(cartItemId: number): void {
    this.#cart.delete(cartItemId);
  }

  // ` deleteByProductId()` cascading 제거
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
