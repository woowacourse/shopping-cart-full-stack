import { validateProductRules } from "./products.validator";
import {
  addProductQuery,
  deleteProductQuery,
  getAllProductsQuery,
  getProductByIdQuery,
  getProductByNameQuery,
} from "./products.repository";
import { AppError } from "@/errors/AppError";
import { removeByProductId } from "../carts/carts.service";

export const getAllProducts = () => {
  return getAllProductsQuery();
};

export const addProduct = (arg: Parameters<typeof addProductQuery>[0]) => {
  validateProductRules(arg);

  const existingProduct = getProductByNameQuery(arg.name);
  if (existingProduct) {
    throw new AppError("DUPLICATE_PRODUCT_NAME");
  }

  return addProductQuery(arg);
};

export const deleteProduct = (id: number) => {
  const existingProduct = getProductByIdQuery(id);
  if (!existingProduct) {
    throw new AppError("NOT_EXIST_PRODUCT");
  }

  removeByProductId(id);
  return deleteProductQuery(id);
};
