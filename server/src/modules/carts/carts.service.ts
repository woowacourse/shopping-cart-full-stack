import { Cart, ProductInCart } from "./carts.model.ts";
import * as cartsRepository from "./carts.repository.ts";
import * as productsRepository from "../products/products.repository.ts";
import { ServiceError } from "../../common/error.ts";

export const getCartById = (cartId: number) => {
  const cart = cartsRepository.findById(cartId);
  if (!cart)
    throw new ServiceError(
      "RESOURCE_NOT_FOUND",
      "id에 해당하는 장바구니가 존재하지 않습니다.",
      404,
    );

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
