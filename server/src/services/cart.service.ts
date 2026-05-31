import { CART_ERROR_RESPONSE, PRODUCT_ERROR_RESPONSE } from "../constants/error.js";
import {
  findAll,
  isAlreadyExist,
  deleteById,
  findProductIdById,
  updateItemQuantity,
  deleteByProductId,
} from "../repositories/cart.repository.js";
import { getProductStockById } from "./products.service.js";

export async function getCartItems() {
  return await findAll();
}

export async function updateCartItemQuantity(id: number, quantity: number) {
  const productId = findProductIdById(id);
  if (productId === null) throw new Error(CART_ERROR_RESPONSE.CART_ITEM_NOT_FOUND.code);

  const stock = await getProductStockById(productId);
  if (stock === null) throw new Error(PRODUCT_ERROR_RESPONSE.PRODUCT_NOT_FOUND.code);
  if (quantity > stock) throw new Error(CART_ERROR_RESPONSE.OUT_OF_STOCK.code);

  updateItemQuantity(id, quantity);
}

export async function deleteCartItem(id: number) {
  if (!isAlreadyExist(id)) {
    throw new Error(CART_ERROR_RESPONSE.CART_ITEM_NOT_FOUND.code);
  }
  await deleteById(id);
}

export async function deleteCartItemByProductId(prductId: number) {
  await deleteByProductId(prductId);
}
