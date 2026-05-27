import { validateProductRules } from "./products.validator";
import {
  addProductQuery,
  getAllProductsQuery,
  getProductByNameQuery,
} from "./products.repository";
import ERROR_CODES from "./products.constants";

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
