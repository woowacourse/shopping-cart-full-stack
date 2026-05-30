import ERROR_CODES from "@/ERROR_CODE";
import createAppError from "@/errors/AppError";
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

export const changeCartQuantity = (id: number, quantity: number) => {
  validateCartQuantity(quantity);

  const existingCartItem = getCartItemByProductIdQuery(id);
  if (!existingCartItem) throw createAppError(ERROR_CODES.NOT_EXIST_CARTS_ITEM);

  const updatedCartItem = updateCartQuantityQuery(id, quantity);
  if (!updatedCartItem) throw createAppError(ERROR_CODES.NOT_EXIST_CARTS_ITEM);

  const product = getProductByIdQuery(id);
  if (!product) throw createAppError(ERROR_CODES.NOT_EXIST_PRODUCT);

  return {
    product,
    quantity: quantity,
  };
};

export const deleteCartsProduct = (id: number) => {
  // 카트 안에 상품이 있는지 확인
  const existingCartsProduct = getCartItemByProductIdQuery(id);

  if (!existingCartsProduct) {
    throw createAppError(ERROR_CODES.NOT_EXIST_CARTS_PRODUCT);
  }

  return deleteCartsProductQuery(id);
};
