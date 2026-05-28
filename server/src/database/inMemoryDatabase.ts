import Product from '../domain/Product.ts';
import ShoppingCart from '../domain/ShoppingCart.ts';
import type { ProductId } from '../types/type.ts';

export const products = new Map<ProductId, Product>();
export const shoppingCart = new ShoppingCart();
