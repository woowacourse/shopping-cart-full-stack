import { findAll, isAlreadyExist, deleteById, findById, updateItemQuantity } from "../repositories/cart.repository.js";
import { findById as findProductById } from "../repositories/products.repository.js";
import { AppError } from "../errors/AppError.js";
import { CART_ITEM_STATUS, CartItem, CartItemStatus, CartItemResponse } from "../interfaces/cart.interface.js";
import { Product } from "../interfaces/product.interface.js";

export async function getCartItems(): Promise<CartItemResponse[]> {
  const cartItems = await findAll();
  const responses = await Promise.all(cartItems.map(toCartItemResponseOrEmpty));
  return responses.flat();
}

export async function updateCartItemQuantity(id: number, quantity: number): Promise<void> {
  const cartItem = await findById(id);
  if (!cartItem) throw new AppError("CART_ITEM_NOT_FOUND", 404);
  const product = await findProductById(cartItem.productId);
  if (!product) throw new AppError("PRODUCT_NOT_FOUND", 404);
  if (quantity > product.stock && quantity > cartItem.quantity) throw new AppError("OUT_OF_STOCK", 409);

  await updateItemQuantity(id, quantity);
}

export async function deleteCartItem(id: number): Promise<void> {
  if (!(await isAlreadyExist(id))) {
    throw new AppError("CART_ITEM_NOT_FOUND", 404);
  }
  await deleteById(id);
}

function getCartItemStatus(quantity: number, stock: number): CartItemStatus {
  if (stock === 0) return CART_ITEM_STATUS.OUT_OF_STOCK;
  if (quantity > stock) return CART_ITEM_STATUS.QUANTITY_EXCEEDED;
  return CART_ITEM_STATUS.AVAILABLE;
}

function toCartItemResponse(item: CartItem, product: Product): CartItemResponse {
  const { name, price, stock, imageUrl } = product;
  const status = getCartItemStatus(item.quantity, stock);
  return { id: item.id, name, price, quantity: item.quantity, stock, status, image_url: imageUrl };
}

async function toCartItemResponseOrEmpty(item: CartItem): Promise<CartItemResponse[]> {
  const product = await findProductById(item.productId);
  if (!product) return [];
  return [toCartItemResponse(item, product)];
}
