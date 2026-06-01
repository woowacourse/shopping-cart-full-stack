import AppError from '../errors/AppError.js';

type CartItem = Map<number, number>;

class Cart {
  private cartItems: CartItem;

  constructor() {
    this.cartItems = new Map();
  }

  addCartItem(id: number, orderCount: number) {
    this.cartItems.set(id, orderCount);
  }

  // 수량 변경
  setOrderCount(id: number, orderCount: number) {
    this.validateOrderCount(id, orderCount);
    this.cartItems.set(id, orderCount);
  }

  deleteCartItem(id: number) {
    this.validateCardItemDeletion(id);
    this.cartItems.delete(id);
  }

  getOrderCount(id: number) {
    return this.cartItems.get(id);
  }

  getCartItem() {
    let result: Array<{ id: number; orderCount: number }> = [];

    this.cartItems.forEach((orderCount, id) => {
      result.push({ id, orderCount });
    });

    return result;
  }

  hasCartItem(id: number) {
    return this.cartItems.has(id);
  }

  private validateOrderCount(id: number, orderCount: number) {
    if (!this.cartItems.has(id)) {
      throw new AppError('PRODUCT_NOT_EXIST_FOR_ORDER');
    }

    if (!orderCount && orderCount !== 0) {
      throw new AppError('EMPTY_PRODUCT_ORDER_COUNT');
    }

    if (typeof orderCount === 'string' || orderCount < 1) {
      throw new AppError('INVALID_PRODUCT_ORDER_COUNT_TYPE');
    }
  }

  private validateCardItemDeletion(id: number) {
    if (!this.cartItems.has(id)) {
      throw new AppError('PRODUCT_NOT_EXIST_IN_CART');
    }
  }
}

export default Cart;
