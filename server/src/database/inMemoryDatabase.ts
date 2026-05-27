import Product from '../domain/Product.ts';
import ShoppingCart from '../domain/ShoppingCart.ts';

export const products = new Map<string, Product>();
export const shoppingCart = new ShoppingCart();
