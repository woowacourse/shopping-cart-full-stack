import { CartRepository } from "./CartRepository.ts";
import { ProductRepository } from "./ProductRepository.ts";

export const productRepository = new ProductRepository();
export const cartRepository = new CartRepository();
