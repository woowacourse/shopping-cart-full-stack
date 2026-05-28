export type Type = {
  cartItemId: string;
  productId: string;
  purchaseQuantity: number;
};

export class CartItem {
  cartItemId;
  productId;
  purchaseQuantity;

  constructor(cartItem: Type) {
    this.validator(cartItem);

    this.cartItemId = cartItem.cartItemId;
    this.productId = cartItem.productId;
    this.purchaseQuantity = cartItem.purchaseQuantity;
  }

  validator(product: Type) {
    if (!Number.isInteger(product.purchaseQuantity)) {
      throw new Error('수량은 정수여야 합니다.');
    }
    if (product.purchaseQuantity < 1 || product.purchaseQuantity > 99) {
      throw new Error('수량은 1이상 99이하여야 합니다.');
    }
  }
}
