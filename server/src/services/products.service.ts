import { CreateProductDto } from "../interfaces/product.interface.js";
import { save, findAll, deleteById, isAlreadyExist } from "../repositories/products.repository.js";
import { deleteByProductId } from "../repositories/cart.repository.js";

export async function addProduct(product: CreateProductDto) {
  await save(product);
}

export async function getProducts() {
  return await findAll();
}

export async function deleteProduct(id: number): Promise<boolean> {
  if (!isAlreadyExist(id)) {
    return false;
  }
  await deleteById(id);
  await deleteByProductId(id);
  return true;
}
