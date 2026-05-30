import { ProductRepository } from "./ProductRepository.ts";
import { CartRepository } from "./CartRepository.ts";

export const productRepository = new ProductRepository();
export const cartRepository = new CartRepository();
