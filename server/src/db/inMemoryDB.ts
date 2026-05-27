import type { CartId, Product } from "./type";

export const ProductDB = new Map<number, Product>();
export const CartDB = new Set<CartId>();
