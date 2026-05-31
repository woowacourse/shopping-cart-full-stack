import { AppError } from "@/errors/AppError";
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
  if (!existingCartItem) throw new AppError("NOT_EXIST_CARTS_ITEM");

  const updatedCartItem = updateCartQuantityQuery(productId, quantity);
  if (!updatedCartItem) throw new AppError("NOT_EXIST_CARTS_ITEM");

  const product = getProductByIdQuery(productId);
  if (!product) throw new AppError("NOT_EXIST_PRODUCT");

  return {
    product,
    quantity: quantity,
  };
};

export const deleteCartsProduct = (id: number) => {
  // 카트 안에 상품이 있는지 확인
  const existingCartsProduct = getCartItemByProductIdQuery(id);

  if (!existingCartsProduct) {
    throw new AppError("NOT_EXIST_CARTS_PRODUCT");
  }

  return deleteCartsProductQuery(id);
};

export const removeByProductId = (productId: number) => {
  const existingCartItem = getCartItemByProductIdQuery(productId);
  if (!existingCartItem) return;

  deleteCartsProductQuery(productId);
};
