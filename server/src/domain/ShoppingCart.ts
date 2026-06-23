import type { ProductId, Quantity, ShoppingCartData } from '../types/type.ts';

export default class ShoppingCart {
  private items = new Map<
    ProductId,
    { quantity: Quantity; isSelected: boolean }
  >();

  add({ productId, quantity, isSelected = true }: ShoppingCartData) {
    this.#validateQuantity(quantity);
    this.items.set(productId, { quantity, isSelected });
  }

  #validateQuantity(quantity: Quantity) {
    if (!Number.isInteger(quantity)) {
      throw new Error('상품 수량은 정수여야 합니다.');
    }

    if (quantity < 1) throw new Error('상품 수량이 1 이상이어야 합니다.');
    if (quantity > 99) throw new Error('상품 수량이 99 이하여야 합니다.');
  }

  getShoppingCart(): ShoppingCartData[] {
    return [...this.items.entries()].map(([productId, item]) => ({
      productId,
      quantity: item.quantity,
      isSelected: item.isSelected,
    }));
  }

  getQuantity(productId: ProductId): Quantity | undefined {
    return this.items.get(productId)?.quantity;
  }

  setQuantity(productId: ProductId, quantity: Quantity) {
    this.#validateQuantity(quantity);
    const item = this.items.get(productId);

    if (!item) return;

    this.items.set(productId, { ...item, quantity });
  }

  setSelection(productId: ProductId, isSelected: boolean) {
    const item = this.items.get(productId);

    if (!item) return;

    this.items.set(productId, { ...item, isSelected });
  }

  setAllSelection(isSelected: boolean) {
    this.items.forEach((item, productId) => {
      this.items.set(productId, { ...item, isSelected });
    });
  }

  deleteProduct(productId: ProductId) {
    this.items.delete(productId);
  }

  hasProductId(productId: ProductId): boolean {
    return this.items.has(productId);
  }
}
