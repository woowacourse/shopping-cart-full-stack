import { BadRequestError } from "../error.ts";
import type { ProductId, Quantity, ShoppingCartData } from "../types/type.ts";

export default class ShoppingCart {
  private items = new Map<ProductId, Quantity>();

  add({ productId, quantity }: ShoppingCartData) {
    this.#validateQuantity(quantity);
    this.items.set(productId, quantity);
  }

  #validateQuantity(quantity: Quantity) {
    if (typeof quantity !== "number") {
      throw new BadRequestError({
        message: "유효하지 않은 수량입니다.",
        field: "quantity",
      });
    }

    if (!Number.isInteger(quantity)) {
      throw new BadRequestError({
        message: "유효하지 않은 수량입니다.",
        field: "quantity",
      });
    }

    if (quantity < 1) {
      throw new BadRequestError({
        message: "상품 수량이 1 이상이어야 합니다.",
        field: "quantity",
      });
    }
    if (quantity > 99) {
      throw new BadRequestError({
        message: "상품 수량이 99 이하여야 합니다.",
        field: "quantity",
      });
    }
  }

  getShoppingCart(): ShoppingCartData[] {
    return [...this.items.entries()].map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
  }

  getQuantity(productId: ProductId): Quantity | undefined {
    return this.items.get(productId);
  }

  setQuantity(productId: ProductId, quantity: Quantity) {
    this.#validateQuantity(quantity);
    this.items.set(productId, quantity);
  }

  deleteProduct(productId: ProductId) {
    this.items.delete(productId);
  }

  hasProductId(productId: ProductId): boolean {
    return this.items.has(productId);
  }
}
