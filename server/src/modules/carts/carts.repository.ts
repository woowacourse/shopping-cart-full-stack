import { rawCarts } from "../../raw/raw.carts.ts";
import { rawProducts } from "../../raw/raw.products.ts";

import { Cart, ProductInCart } from "./carts.model.ts";

export const findById = (id: number) => {
  const cart = rawCarts.find((cart) => cart.id === id);
  if (!cart) return undefined;

  const products = cart.products.map((product) => {
    const productData = rawProducts.find(
      (rawProduct) => rawProduct.id === product.id,
    )!;
    return { ...product, ...productData };
  });

  return new Cart({
    id: cart.id,
    products: products.map((product) => new ProductInCart(product)),
  });
};
