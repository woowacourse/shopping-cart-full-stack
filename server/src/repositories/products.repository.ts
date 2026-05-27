import { newProduct, Product } from "../../interfaces/product.interface.js";

const products: Product[] = [];

export function save(product: newProduct) {
  const id = (products.at(-1)?.id ?? 0) + 1;

  const newProduct: Product = {
    id: id,
    ...product,
  };

  products.push(newProduct);
}
