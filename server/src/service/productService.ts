import { products } from '../database/inMemoryDatabase.ts';
import Product from '../domain/Product.ts';

export function createProduct({
  name,
  price,
  image,
}: {
  name: string;
  price: number;
  image?: string;
}) {
  const product = new Product({ name, price, image });
  products.set(product.getProduct().id, product);
  return [...products.values()];
}

export function getAllProducts() {
  return [...products.values()];
}

export function deleteProduct(id: string) {
  products.delete(id);
}
