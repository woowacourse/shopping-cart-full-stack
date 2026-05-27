import { CreateProductDto } from "../../interfaces/product.interface.js";
import { save } from "../repositories/products.repository.js";

export async function addProduct(product: CreateProductDto) {
  await save(product);
}
