import { getProductsHandler } from "./products/get-products";
import { postProductHandler } from "./products/post-product";
import { deleteProductHandler } from "./products/delete-product";

import { getCartHandler } from "./cart/get-cart";
import { patchCartHandler } from "./cart/patch-cart";
import { deleteCartHandler } from "./cart/delete-cart";

import { postCheckoutHandler, postPaymentHandler } from "./checkout";

export const handlers = [
  getProductsHandler,
  postProductHandler,
  deleteProductHandler,

  getCartHandler,
  patchCartHandler,
  deleteCartHandler,

  postCheckoutHandler,
  postPaymentHandler,
];
