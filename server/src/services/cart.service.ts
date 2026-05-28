import { UpdateResultKey } from "../../interfaces/cart.interface.js";
import {
  findAll,
  isAlreadyExist,
  deleteById,
  findProductIdById,
  updateItemQuantity,
} from "../repositories/cart.repository.js";
import { findStockById } from "../repositories/products.repository.js";

export async function getCartItems() {
  return await findAll();
}

export async function updateCartItemQuantity(id: number, quantity: number): Promise<UpdateResultKey | "SUCCESS"> {
  const productId = findProductIdById(id);
  if (productId === -1) return "CART_ITEM_NOT_FOUND";
  const stock = findStockById(productId);
  if (stock === -1) return "PRODUCT_NOT_FOUND";
  if (quantity > stock) return "OUT_OF_STOCK";

  updateItemQuantity(id, quantity);
  return "SUCCESS";
}

export async function deleteCartItem(id: number) {
  if (!isAlreadyExist(id)) {
    return false;
  }
  await deleteById(id);
  return true;
}
