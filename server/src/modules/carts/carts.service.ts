import { Cart, ProductInCart } from "./carts.model.ts";
import * as cartsRepository from "./carts.repository.ts";
import * as productsRepository from "../products/products.repository.ts";

export const getCartById = (cartId: number) => {
  const cart = cartsRepository.findById(cartId);
  if (!cart) return undefined;
  return {
    id: cart.id,
    products: cart.products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      imgUrl: product.imgUrl,
      quantity: product.quantity,
    })),
  };
};
