import ERROR_CODES from "@/ERROR_CODE";
import { getProductByIdQuery } from "../products/products.repository";
import {
  deleteCartsProductQuery,
  getCartItemByProductIdQuery,
  getCartsQuery,
  updateCartQuantityQuery,
} from "./carts.repository";
import { validateCartQuantity } from "./carts.validator";

export const getCarts = () => {
  return getCartsQuery();
};

export const changeCartQuantity = (productId: number, quantity: number) => {
  validateCartQuantity(quantity);

  const existingCartItem = getCartItemByProductIdQuery(productId);
  if (!existingCartItem) throw new Error(ERROR_CODES.NOT_EXIST_CARTS_ITEM.code);

  const updatedCartItem = updateCartQuantityQuery(productId, quantity);
  if (!updatedCartItem) throw new Error(ERROR_CODES.NOT_EXIST_CARTS_ITEM.code);

  const product = getProductByIdQuery(productId);
  if (!product) throw new Error(ERROR_CODES.NOT_EXIST_PRODUCT.code);

  return {
    product,
    quantity: quantity,
  };
};

export const deleteCartsProduct = (productId: number) => {
  const existingCartsProduct = getCartItemByProductIdQuery(productId);

  if (!existingCartsProduct) {
    throw new Error(ERROR_CODES.NOT_EXIST_CARTS_PRODUCT.code);
  }

  return deleteCartsProductQuery(productId);
};
