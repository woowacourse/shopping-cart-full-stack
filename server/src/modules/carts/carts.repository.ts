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

export const updateProductQuantity = (
  cartId: number,
  productId: number,
  quantity: number,
) => {
  const cart = rawCarts.find((cart) => cart.id === cartId);
  if (!cart) return undefined;

  const product = cart.products.find((product) => product.id === productId);
  if (!product) return undefined;

  product.quantity = quantity;

  return findById(cartId)?.products.find((product) => product.id === productId);
};

export const deleteProductInCart = (cartId: number, productId: number) => {
  const cart = rawCarts.find((cart) => cart.id === cartId);
  if (!cart) return;

  const productIndex = cart.products.findIndex(
    (product) => product.id === productId,
  );
  if (productIndex === -1) return;

  cart.products.splice(productIndex, 1);
};
