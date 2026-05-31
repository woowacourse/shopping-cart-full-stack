import { CreateProductDto } from "../interfaces/product.interface.js";
import { save, findAll, deleteById, isAlreadyExist, findStockById } from "../repositories/products.repository.js";
import { PRODUCT_ERROR_RESPONSE } from "../constants/error.js";
import { deleteCartItemByProductId } from "./cart.service.js";

export async function addProduct(product: CreateProductDto) {
  await save(product);
}

export async function getProducts() {
  return await findAll();
}

export async function getProductStockById(id: number) {
  return await findStockById(id);
}

export async function deleteProduct(id: number) {
  if (!isAlreadyExist(id)) {
    throw new Error(PRODUCT_ERROR_RESPONSE.PRODUCT_NOT_FOUND.code);
  }
  await deleteById(id);
  await deleteCartItemByProductId(id);
}
