import { getProducts } from "./getProducts";
import { postProducts } from "./postProducts";
import { deleteProduct } from "./deleteProduct";

export const productHandlers = [getProducts, postProducts, deleteProduct];
