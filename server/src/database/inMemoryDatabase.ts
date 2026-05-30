import Product from "../domain/Product.ts";
import type { ProductId } from "../types/type.ts";
import { CartRepository } from "./CartRepository.ts";

export const products = new Map<ProductId, Product>();
export const cartRepository = new CartRepository();
