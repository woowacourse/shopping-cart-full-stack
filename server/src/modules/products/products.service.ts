import { validateProductRules } from "./products.validator";
import {
  addProductQuery,
  deleteProductQuery,
  getAllProductsQuery,
  getProductByIdQuery,
  getProductByNameQuery,
} from "./products.repository";
import ERROR_CODES from "../../ERROR_CODE";
import { removeByProductId } from "../carts/carts.service";

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
  const existingProduct = getProductByIdQuery(id);
  if (!existingProduct) {
    throw new Error(ERROR_CODES.NOT_EXIST_PRODUCT.code);
  }

  removeByProductId(id);
  return deleteProductQuery(id);
};
