import { BadRequestError } from "../error.ts";
import type { ProductId, Quantity, ShoppingCartData } from "../types/type.ts";

export default class ShoppingCart {
  productId: ProductId;
  quantity: Quantity;

  constructor(productId: ProductId, quantity: Quantity) {
    ShoppingCart.validateQuantity(quantity);
    this.productId = productId;
    this.quantity = quantity;
  }

  static validateQuantity(quantity: Quantity) {
    if (typeof quantity !== "number") {
      throw new BadRequestError({
        code: "INVALID_TYPE",
        message: "유효하지 않은 수량입니다.",
        field: "quantity",
      });
    }

    if (!Number.isInteger(quantity)) {
      throw new BadRequestError({
        code: "INVALID_QUANTITY",
        message: "유효하지 않은 수량입니다.",
        field: "quantity",
      });
    }

    if (quantity < 1) {
      throw new BadRequestError({
        code: "INVALID_QUANTITY",
        message: "상품 수량이 1 이상이어야 합니다.",
        field: "quantity",
      });
    }
    if (quantity > 99) {
      throw new BadRequestError({
        code: "INVALID_QUANTITY",
        message: "상품 수량이 99 이하여야 합니다.",
        field: "quantity",
      });
    }
  }
}
