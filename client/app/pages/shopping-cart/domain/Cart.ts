import { CartItem } from "../types";

class Cart {
  constructor(
    private readonly items: CartItem[],
    private readonly selectedItemIds: string[] | null,
  ) {
    this.items = items;
    this.selectedItemIds = selectedItemIds;
  }

  public isItemAllSelected() {
    return this.getSelectedItems().length === this.items.length;
  }

  public selectedItemCount() {
    return this.getSelectedItems().length;
  }

  public selectedItemTotalQuantity() {
    return this.getSelectedItems().reduce(
      (quantity, item) => quantity + item.quantity,
      0,
    );
  }

  public calculateItemTotalPrice(): number {
    return this.getSelectedItems().reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    );
  }

  private getSelectedItems(): CartItem[] {
    if (!this.selectedItemIds) return [];
    return this.items.filter((item) =>
      this.selectedItemIds!.includes(item.product_id),
    );
  }
}

export default Cart;
