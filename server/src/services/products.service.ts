import { CreateProductDto } from "../interfaces/product.interface.js";
import { save, findAll, deleteById, isAlreadyExist } from "../repositories/products.repository.js";
import { AppError } from "../errors/AppError.js";

export async function addProduct(product: CreateProductDto) {
  await save(product);
}

export async function getProducts() {
  return await findAll();
}

export async function deleteProduct(id: number): Promise<void> {
  if (!(await isAlreadyExist(id))) {
    throw new AppError("PRODUCT_NOT_FOUND", 404);
  }
  // 연결된 cart_item은 FK(ON DELETE CASCADE)가 함께 삭제한다.
  await deleteById(id);
}
