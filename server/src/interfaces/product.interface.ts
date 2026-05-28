import * as z from "zod";
import { createProductRequestSchema } from "../schemas/product.schema.js";

export type CreateProductDto = z.infer<typeof createProductRequestSchema>;

export type newProduct = Omit<Product, "id">;

export interface Product {
  id: number;
  name: string;
  stock: number;
  imageUrl: string;
  price: number;
}
