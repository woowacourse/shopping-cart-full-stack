import { Product } from "./products.model.ts";
import { rawProducts } from "../../raw/raw.products.ts";
import type { ProductRequest } from "./products.dto.ts";

export const findAll = () => {
  return rawProducts.map((product) => new Product(product));
};

export const findById = () => {
  return rawProducts.map((product) => new Product(product));
};

export const create = (product: ProductRequest) => {
  const id = Number(rawProducts.at(-1)?.id ?? 0) + 1;
  const newProduct = {
    ...product,
    id: String(id),
  };

  rawProducts.push(newProduct);

  return newProduct;
};
