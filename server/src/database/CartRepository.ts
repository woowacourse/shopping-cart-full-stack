import { ShoppingCartData, ProductId, Quantity } from "../types/type.ts";
import ShoppingCart from "../domain/ShoppingCart.ts";

export class CartRepository {
  private items = new Map<ProductId, Quantity>();

  save(item: ShoppingCart) {
    this.items.set(item.productId, item.quantity);
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
    this.items.set(productId, quantity);
  }

  removeItem(productId: ProductId) {
    this.items.delete(productId);
  }

  hasProductId(productId: ProductId): boolean {
    return this.items.has(productId);
  }
}
