import { CartItemData, validateCartItemData } from "./CartItem";

class CartRepository {
  #cart: Map<number, CartItemData>;
  #nextId: number;

  constructor() {
    this.#cart = new Map();
    this.#nextId = 1;
  }

  // `getCartProducts()` 장바구니 목록 조회
  getCartProducts(): CartItemData[] {
    return [...this.#cart.values()];
  }

  // `addProductToCart()` 장바구니 목록 추가
  addProductToCart(productId: number, quantity: number): CartItemData {
    validateCartItemData(quantity);
    const cartItem = { productId, quantity, cartItemId: this.#nextId };
    this.#cart.set(this.#nextId, cartItem);
    this.#nextId++;
    return cartItem;
  }

  // `changeQuantity()` 장바구니 수량 변경
  changeQuantity(cartItemId: number, newQuantity: number): void {
    validateCartItemData(newQuantity);
    // cartItemId를 찾아서
    const cartItem = this.#cart.get(cartItemId);
    if (!cartItem) return;
    // newQuantity로 업데이트
    const newItem = { ...cartItem, quantity: newQuantity };
    this.#cart.set(cartItemId, newItem);
  }

  // ` deleteByCartId()` 장바구니 목록 제거
  deleteByCartId(cartItemId: number): void {
    this.#cart.delete(cartItemId);
  }

  // ` deleteByProductId()` cascading 제거
  deleteByProductId(productId: number): void {
    [...this.#cart.entries()]
      .filter(([_, cartItemData]) => cartItemData.productId === productId)
      .forEach(([cartItemId]) => this.#cart.delete(cartItemId));
  }
}

export const cartRepository = new CartRepository();
