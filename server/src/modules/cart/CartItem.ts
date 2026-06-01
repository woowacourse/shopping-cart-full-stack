import AppError from "../../errors/AppError.js";

export type CartItemType = {
  productId: number;
  itemCount: number;
};

class CartItem {
  constructor(
    private productId: number,
    private itemCount: number,
  ) {
    CartItem.validateItemCount(itemCount);
  }

  updateItemCount(itemCount: number) {
    CartItem.validateItemCount(itemCount);
    this.itemCount = itemCount;
  }

  isSameProductId(productId: number) {
    return this.productId === productId;
  }

  toJson() {
    return {
      productId: this.productId,
      itemCount: this.itemCount,
    };
  }

  static validateItemCount(itemCount: number) {
    if (!itemCount && itemCount !== 0) {
      throw new AppError("EMPTY_PRODUCT_ORDER_COUNT");
    }

    if (typeof itemCount === "string" || itemCount < 1) {
      throw new AppError("INVALID_PRODUCT_ORDER_COUNT_TYPE");
    }
  }
}

export default CartItem;
