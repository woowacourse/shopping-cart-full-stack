import { Product } from "./products.model.js";
import { rawProducts } from "../../raw/raw.products.js";

export const findAll = () => {
  return rawProducts.map((product) => new Product(product));
};
