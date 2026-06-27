import { getCart } from "./getCart";
import { patchCartProduct } from "./patchCartProduct";
import { deleteCartProduct } from "./deleteCartProduct";

export const cartHandlers = [getCart, patchCartProduct, deleteCartProduct];
