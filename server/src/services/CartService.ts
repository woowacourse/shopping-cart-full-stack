import { cartItems } from "../db.js";
import { InvalidInputError, NotFoundError } from "../errors/HttpError.js";
import type { UpdateCartQuantityRequestBody } from "../type.js";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

const isValidQuantity = (quantity: unknown) => {
  return (
    typeof quantity === "number" &&
    Number.isInteger(quantity) &&
    quantity >= MIN_QUANTITY &&
    quantity <= MAX_QUANTITY
  );
};

const isUpdateCartQuantityRequestBody = (
  body: unknown,
): body is UpdateCartQuantityRequestBody => {
  return typeof body === "object" && body !== null;
};

const isValidUpdateCartQuantityBody = (
  body: unknown,
): body is UpdateCartQuantityRequestBody => {
  if (!isUpdateCartQuantityRequestBody(body)) {
    return false;
  }

  return isValidQuantity(body.quantity);
};

export const cartService = {
  getCartItems() {
    return cartItems.findAll();
  },

  updateQuantity(id: string, body: unknown): number {
    if (!isValidUpdateCartQuantityBody(body)) {
      throw new InvalidInputError();
    }

    const updatedCartItem = cartItems.updateQuantity(id, body.quantity);

    if (!updatedCartItem) {
      throw new NotFoundError();
    }

    return updatedCartItem.getQuantity();
  },

  deleteCartItem(id: string): void {
    const isDeleted = cartItems.deleteById(id);

    if (!isDeleted) {
      throw new NotFoundError();
    }
  },
};
