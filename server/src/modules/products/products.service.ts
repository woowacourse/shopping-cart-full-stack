import { validateProductRules } from "./products.validator";
import {
  addProductQuery,
  deleteProductQuery,
  getAllProductsQuery,
  getProductByIdQuery,
  getProductByNameQuery,
} from "./products.repository";
import ERROR_CODES from "../../ERROR_CODE";
import {
  deleteCartQuery,
  getCartItemByProductIdQuery,
} from "../carts/carts.repository";

export const getAllProducts = () => {
  return getAllProductsQuery();
};

export const addProduct = (arg: Parameters<typeof addProductQuery>[0]) => {
  validateProductRules(arg);

  const existingProduct = getProductByNameQuery(arg.name);
  if (existingProduct) {
    throw new Error(ERROR_CODES.DUPLICATE_PRODUCT_NAME.code);
  }

  return addProductQuery(arg);
};

export const deleteProduct = (id: number) => {
  // 존재하지 않는 상품인지 확인
  const existingProduct = getProductByIdQuery(id);
  if (!existingProduct) {
    throw new Error(ERROR_CODES.NOT_EXIST_PRODUCT.code);
  }

  deleteProductQuery(id);

  const existingCartItem = getCartItemByProductIdQuery(id);
  if (existingCartItem) {
    deleteCartQuery(id);
  }

  return id;
};
