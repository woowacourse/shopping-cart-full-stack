import Cart from "./Cart.js";

export interface CartRepository {
  create(): Cart;
  findById(cartId: number): Cart | undefined;
  removeProductFromAllCarts(productId: number): void;
}

export class InMemoryCartRepository implements CartRepository {
  private carts: Array<Cart> = [];
  private id = 1;

  create() {
    const cart = new Cart(this.id);

    this.carts.push(cart);
    this.id++;

    return cart;
  }

  findById(cartId: number) {
    return this.carts.find((cart) => cart.isSameId(cartId));
  }

  removeProductFromAllCarts(productId: number) {
    this.carts.forEach((cart) => {
      const hasCartItem = cart
        .toJsonCartItems()
        .some((cartItem) => cartItem.productId === productId);

      if (hasCartItem) {
        cart.deleteCartItem(productId);
      }
    });
  }
}
