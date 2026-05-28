import type { CartItem, Product } from "../type";

export const ProductDB = new Map<number, Product>();
export const CartDB = new Set<CartItem>();
