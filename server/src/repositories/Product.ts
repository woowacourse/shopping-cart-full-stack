export interface ProductData {
  productId: number;
  name: string;
  price: number;
  thumbnailUrl: string;
  totalQuantity: number;
}

export type ProductInput = Omit<ProductData, "productId">;
