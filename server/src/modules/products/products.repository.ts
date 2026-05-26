import { Product } from "./products.model.js";

const products: Product[] = [
  new Product(
    "1",
    18000,
    "Shopping Basket",
    "https://example.com/images/shopping-basket.png",
  ),
  new Product(
    "2",
    32000,
    "Tote Bag",
    "https://example.com/images/tote-bag.png",
  ),
  new Product(
    "3",
    9900,
    "Reusable Cup",
    "https://example.com/images/reusable-cup.png",
  ),
];

export const findAll = () => {
  return products;
};
