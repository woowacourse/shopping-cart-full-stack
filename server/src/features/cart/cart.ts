import { CartValidationError } from "./cart.error.js";

export interface CartProps {
  productId: number;
  quantity: number;
}

export default class Cart {
  static MIN_QUANTITY = 1;
  static MAX_QUANTITY = 99;

  private readonly productId: number;
  private readonly quantity: number;

  constructor({ productId, quantity }: CartProps) {
    this.validate({ productId, quantity });

    this.productId = productId;
    this.quantity = quantity;
  }

  private validate = (cartData: CartProps) => {
    const { quantity } = cartData;

    if (quantity < Cart.MIN_QUANTITY || quantity > Cart.MAX_QUANTITY) {
      throw new CartValidationError();
    }
  };

  getCart() {
    return {
      productId: this.productId,
      quantity: this.quantity,
    };
  }

  toEntity() {
    return {
      product_id: this.productId,
      quantity: this.quantity,
    };
  }
}
