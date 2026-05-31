import { productRepository } from "../database/inMemoryDatabase.ts";
import Product from "../domain/Product.ts";
import type { ProductData, ProductId } from "../types/type.ts";
import { BadRequestError } from "../error.ts";

function isDuplicateName(name: string) {
  return getAllProducts().some((product) => {
    return product.name === name;
  });
}

export function addProductToList({ name, price, image }: ProductData) {
  if (isDuplicateName(name)) {
    throw new BadRequestError({
      code: "INVALID_NAME",
      message: "중복된 상품명입니다.",
      field: "productName",
    });
  }

  const productId = crypto.randomUUID();
  const product = new Product(productId, { name, price, image });
  productRepository.save(productId, product);
}

export function getAllProducts(): Product[] {
  return productRepository.getAllProducts();
}

export function removeProductFromList(productId: ProductId) {
  productRepository.remove(productId);
}

export function existsProductId(productId: string): boolean {
  return productRepository.hasId(productId);
}
