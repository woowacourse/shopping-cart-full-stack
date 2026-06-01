import { ProductData, ProductInput } from "../Product";

export interface ProductRepositoryInterface {
  getProducts(): ProductData[];
  findById(productId: number): ProductData | null;
  addProduct(data: ProductInput): ProductData;
  deleteById(productId: number): void;
}
