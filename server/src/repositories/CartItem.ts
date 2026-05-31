export interface StoredCartItem {
  cartItemId: number;
  productId: number;
  quantity: number;
}

export interface CartItemData {
  cartItemId: number;
  quantity: number;
  productId: number;
  productData: {
    productId: number;
    name: string;
    price: number;
    thumbnailUrl: string;
    totalQuantity: number;
  };
}
