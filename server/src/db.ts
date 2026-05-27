import { CartItem } from './modules/cart/cartItem.model.js';
import { Product } from './modules/products/product.model.js';

export const productsDB = new Map<string, Product>();

export const cartItemsDB = new Map<string, CartItem>();
