import { Product } from "../products/products.model.ts";

export class ProductInCart extends Product {
  quantity: number;

  constructor({
    id,
    price,
    name,
    imgUrl,
    quantity,
  }: {
    id: number;
    price: number;
    name: string;
    imgUrl: string;
    quantity: number;
  }) {
    super({ id, price, name, imgUrl });
    this.quantity = quantity;
  }
}

export class Cart {
  id: number;
  products: ProductInCart[];

  constructor({ id, products }: { id: number; products: ProductInCart[] }) {
    this.id = id;
    this.products = products;
  }
}
