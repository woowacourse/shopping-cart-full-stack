import { Product } from "./products.model.ts";
import { rawProducts } from "../../raw/raw.products.ts";

export const findAll = () => {
  return rawProducts.map((product) => new Product(product));
};
