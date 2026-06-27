import { newProduct, Product } from "../interfaces/product.interface.js";

const products: Product[] = [
  {
    id: 1,
    name: "나이키",
    stock: 10,
    imageUrl: "https://picsum.photos/seed/laptop/160/160",
    price: 30000,
  },
  {
    id: 2,
    name: "아디다스",
    stock: 5,
    imageUrl: "https://picsum.photos/seed/camera/160/160",
    price: 25000,
  },
];

export function isAlreadyExist(id: number) {
  return products.some((product) => product.id === id);
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

export function findById(id: number) {
  return products.find((product) => product.id === id) ?? null;
}

export function findStockById(id: number) {
  const product = findById(id);
  if (product) {
    return product.stock;
  }
  return null;
}

export function deleteById(id: number) {
  const index = products.findIndex((product) => product.id === id);
  products.splice(index, 1);
}

export function reset() {
  products.length = 0;
}
