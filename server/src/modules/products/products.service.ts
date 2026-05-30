import { validateProductRules } from "./products.validator";
import {
  addProductQuery,
  deleteProductQuery,
  getAllProductsQuery,
  getProductByIdQuery,
  getProductByNameQuery,
} from "./products.repository";
import ERROR_CODES from "../../ERROR_CODE";
import createAppError from "@/errors/AppError";
import { removeCartItemByProductId } from "../carts/carts.service";

export const getAllProducts = () => {
  return getAllProductsQuery();
};

export const addProduct = (arg: Parameters<typeof addProductQuery>[0]) => {
  validateProductRules(arg);

  const existingProduct = getProductByNameQuery(arg.name);
  if (existingProduct) {
    throw createAppError(ERROR_CODES.DUPLICATE_PRODUCT_NAME);
  }

  return addProductQuery(arg);
};

export const deleteProduct = (id: number) => {
  // 존재하지 않는 상품인지 확인
  const existingProduct = getProductByIdQuery(id);
  if (!existingProduct) {
    throw createAppError(ERROR_CODES.NOT_EXIST_PRODUCT);
  }

  deleteProductQuery(id);

  // 연관 장바구니 항목 정리는 carts 모듈의 공개 API(service)에 위임한다.
  removeCartItemByProductId(id);

  return id;
};
