import type { ProductId, Quantity, ShoppingCartData } from '../types/type.ts';

export default class ShoppingCart {
  private items = new Map<ProductId, Quantity>();

  add({ productId, quantity }: ShoppingCartData) {
    this.#validateQuantity(quantity);
    this.items.set(productId, quantity);
  }

  #validateQuantity(quantity: Quantity) {
    if (!Number.isInteger(quantity)) {
      throw new Error('상품 수량은 정수여야 합니다.');
    }

    if (quantity < 1) throw new Error('상품 수량이 1 이상이어야 합니다.');
    if (quantity > 99) throw new Error('상품 수량이 99 이하여야 합니다.');
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
