import type { ProductResponse } from "./products.dto.ts";
import * as productsRepository from "./products.repository.ts";
import * as cartsRepository from "../carts/carts.repository.ts";
import { ServiceError } from "../../common/error.ts";
import type { ProductRequest } from "./products.dto.ts";
import * as validate from "./products.validate.ts";

export const getProducts = (): ProductResponse[] => {
  return productsRepository.findAll().map((product) => ({
    id: product.id,
    price: product.price,
    name: product.name,
    imgUrl: product.imgUrl,
  }));
};

export const createProduct = (productRequest: Partial<ProductRequest>) => {
  validate.createProduct.validateRequiredFields(productRequest);
  validate.createProduct.validateTypes(productRequest);
  validate.createProduct.validateDomainRules(productRequest);

  const product = productsRepository.create(productRequest as ProductRequest);

  return product;
};

export const deleteProduct = (id: number) => {
  const product = productsRepository.findById(id);

  if (!product) {
    throw new ServiceError(
      "RESOURCE_NOT_FOUND",
      "id에 해당하는 상품이 존재하지 않습니다.",
    );
  }

  productsRepository.deleteById(id);
  cartsRepository.deleteByProductId(id);
};
