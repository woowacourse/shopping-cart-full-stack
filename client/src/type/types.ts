export interface CartItem {
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
