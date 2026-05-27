type CartItem = Map<number, number>;

class Cart {
  private cartItems: CartItem;

  constructor() {
    this.cartItems = new Map();
  }

  updateProductQuantity(id: number, orderCount: number) {
    this.cartItems.set(id, orderCount);
  }

  getOrderCount(id: number) {
    return this.cartItems.get(id);
  }
}

export default Cart;
