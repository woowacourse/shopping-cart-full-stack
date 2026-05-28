import ERROR_CODES from "@/ERROR_CODE";
import { getProductByIdQuery } from "../products/products.repository";
import {
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
  if (!existingCartItem) throw new Error(ERROR_CODES.NOT_EXIST_CARTS_ITEM.code);

  const updatedCartItem = updateCartQuantityQuery(id, quantity);
  if (!updatedCartItem) throw new Error(ERROR_CODES.NOT_EXIST_CARTS_ITEM.code);

  const product = getProductByIdQuery(id);
  if (!product) throw new Error(ERROR_CODES.NOT_EXIST_PRODUCT.code);

  return {
    product,
    quantity: quantity,
  };
};
