import type { ProductResponse } from "./products.dto.js";
import * as productsRepository from "./products.repository.js";

export const getProducts = (): ProductResponse[] => {
  return productsRepository.findAll().map((product) => ({
    id: product.id,
    price: product.price,
    name: product.name,
    imgUrl: product.imgUrl,
  }));
};
