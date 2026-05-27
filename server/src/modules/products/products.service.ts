import { validateProductRules } from "./products.validator";
import { addProductQuery, getAllProductsQuery } from "./products.repository";

export const getAllProducts = () => {
  return getAllProductsQuery();
};

export const addProduct = (arg: Parameters<typeof addProductQuery>[0]) => {
  validateProductRules(arg);
  return addProductQuery(arg);
};
