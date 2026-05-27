import { getAllProductsQuery } from "./products.repository";

export const getAllProducts = () => {
  return getAllProductsQuery();
};
