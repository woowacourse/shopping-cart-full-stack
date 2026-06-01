import AppError from "../../errors/AppError.js";
import CartItem from "./CartItem.js";

class Cart {
  private cartItems: CartItem[];
  constructor(private id: number) {
    this.cartItems = [];
  }
  addCartItem(productId: number, itemCount: number) {
    const targetCartItem = this.findCartItemByProductId(productId);

    if (targetCartItem) {
      const newItemCount = targetCartItem.toJson().itemCount + itemCount;
      targetCartItem.updateItemCount(newItemCount);
      return;
    }

    this.cartItems.push(new CartItem(productId, itemCount));
  }

  deleteCartItem(productId: number) {
    const targetCartItem = this.findCartItemByProductId(productId);
    if (!targetCartItem) {
      throw new AppError("PRODUCT_NOT_EXIST_IN_CART");
    }

    this.cartItems = this.cartItems.filter(
      (cartItem) => !cartItem.isSameProductId(productId),
    );
  }

  updateCartItemCount(productId: number, itemCount: number) {
    const targetCartItem = this.findCartItemByProductId(productId);

    if (!targetCartItem) {
      throw new AppError("PRODUCT_NOT_EXIST_IN_CART");
    }

    targetCartItem.updateItemCount(itemCount);
  }

  private findCartItemByProductId(productId: number) {
    return this.cartItems.find((carItem) => carItem.isSameProductId(productId));
  }

  getItemCount(productId: number) {
    return this.findCartItemByProductId(productId)?.toJson().itemCount ?? 0;
  }

  toJsonCartItems() {
    return this.cartItems.map((cartItem) => cartItem.toJson());
  }

  toJson() {
    return {
      id: this.id,
      cartItems: this.toJsonCartItems(),
    };
  }

  isSameId(cartId: number) {
    return this.id === cartId;
  }
}

export default Cart;
