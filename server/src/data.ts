import Product from "./models/Product.js";
import Cart from "./models/Cart.js";
import { MY_CART_ID } from "./constanst.js";

export const INITIAL_DATA = {
  products: new Map<string, Product>(),
  cart: new Map<string, Cart>([[MY_CART_ID, new Cart()]]),
};
