import AppError from './AppError.js';

type CartItem = Map<number, number>;

class Cart {
  private cartItems: CartItem;

  constructor() {
    this.cartItems = new Map();

    // 장바구니에 상품 추가 기능이 없기 때문에 mockData 사용
    this.cartItems.set(1, 10);
    this.cartItems.set(2, 5);
  }

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
