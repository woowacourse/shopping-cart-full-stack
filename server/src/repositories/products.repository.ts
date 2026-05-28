import { newProduct, Product } from "../interfaces/product.interface.js";

const products: Product[] = [];

export function isAlreadyExist(id: number) {
  if (products.find((product) => product.id === id)) return true;
  return false;
}

export function save(product: newProduct) {
  const id = (products.at(-1)?.id ?? 0) + 1;

  const newProduct: Product = {
    id: id,
    ...product,
  };

  products.push(newProduct);
}

export function findAll() {
  return [...products];
}

export function findStockById(id: number) {
  const product = products.find((product) => product.id === id);
  if (product) {
    return product.stock;
  }
  return -1;
}

export function deleteById(id: number): boolean {
  const index = products.findIndex((product) => product.id === id);
  products.splice(index, 1);
  return true;
}

export function reset() {
  products.length = 0;
}
