import type { ProductResponse } from "./products.dto.ts";
import * as productsRepository from "./products.repository.ts";
import { ProductRequest } from "./products.dto.ts";

export const getProducts = (): ProductResponse[] => {
  return productsRepository.findAll().map((product) => ({
    id: product.id,
    price: product.price,
    name: product.name,
    imgUrl: product.imgUrl,
  }));
};

export const createProduct = (productRequest: ProductRequest) => {
  const product = productsRepository.create(productRequest);

  return product;
};
