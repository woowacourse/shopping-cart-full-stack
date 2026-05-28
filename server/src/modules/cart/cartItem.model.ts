import { ModelError } from '../../errors/ModelError.js';

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
      throw new ModelError(
        'INVALID_PURCHASE_QUANTITY',
        '유효하지 않은 구매 수량입니다.',
      );
    }
    if (product.purchaseQuantity < 1 || product.purchaseQuantity > 99) {
      throw new ModelError(
        'INVALID_PURCHASE_QUANTITY',
        '유효하지 않은 구매 수량입니다.',
      );
    }
  }

  changeQuantityTo(quantity: number) {
    this.purchaseQuantity = quantity;
  }
}
