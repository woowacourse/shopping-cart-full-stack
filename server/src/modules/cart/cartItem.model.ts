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
    this.validatePurchaseQuantity(cartItem.purchaseQuantity);

    this.cartItemId = cartItem.cartItemId;
    this.productId = cartItem.productId;
    this.purchaseQuantity = cartItem.purchaseQuantity;
  }

  changeQuantityTo(quantity: number) {
    this.validatePurchaseQuantity(quantity);

    this.purchaseQuantity = quantity;
  }

  validatePurchaseQuantity = (purchaseQuantity: number) => {
    if (
      !Number.isInteger(purchaseQuantity) ||
      purchaseQuantity < 1 ||
      purchaseQuantity > 99
    ) {
      throw new ModelError(
        'INVALID_PURCHASE_QUANTITY',
        '유효하지 않은 구매 수량입니다.',
      );
    }
  };
}
