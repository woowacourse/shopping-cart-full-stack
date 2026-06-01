import { Product } from "./products.model.ts";
import { productStore } from "../../raw/raw.products.ts";
import type { ProductRequest } from "./products.dto.ts";

const getNextProductId = () =>
  Math.max(...productStore.products.map((product) => product.id), 0) + 1;

let nextProductId = getNextProductId();

export const findAll = () => {
  return productStore.products.map((product) => new Product(product));
};

export const findById = (id: number) => {
  const product = productStore.products.find((product) => product.id === id);

  return product ? new Product(product) : undefined;
};

export const create = (product: ProductRequest) => {
  const newProduct = {
    ...product,
    id: nextProductId++,
  };

  productStore.products.push(newProduct);

  return newProduct;
};

export const deleteById = (id: number) => {
  const productIndex = productStore.products.findIndex(
    (product) => product.id === id,
  );

  if (productIndex === -1) return;

  productStore.products.splice(productIndex, 1);
};

export const resetProductRepository = () => {
  nextProductId = getNextProductId();
  productStore.reset();
};
