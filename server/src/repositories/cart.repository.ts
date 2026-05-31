import { CartItem, newCartItem } from "../interfaces/cart.interface.js";

const cartItems: CartItem[] = [];

export function isAlreadyExist(id: number) {
  return cartItems.some((item) => item.id === id);
}

export function saveNewItem(newItem: newCartItem) {
  const id = (cartItems.at(-1)?.id ?? 0) + 1;
  cartItems.push({ id, ...newItem });
}

export function updateItemQuantity(id: number, quantity: number) {
  const item = cartItems.find((item) => item.id === id);
  if (item) {
    item.quantity = quantity;
  }
}

export function deleteById(id: number) {
  const index = cartItems.findIndex((item) => item.id === id);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }
}

export function deleteByProductId(productId: number) {
  const index = cartItems.findIndex((item) => item.productId === productId);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }
}

export function findAll(): CartItem[] {
  return [...cartItems];
}

export function findProductIdById(id: number) {
  const index = cartItems.find((item) => item.id === id);
  if (index) {
    return index.productId;
  }
  return null;
}

export function reset() {
  cartItems.length = 0;
}
