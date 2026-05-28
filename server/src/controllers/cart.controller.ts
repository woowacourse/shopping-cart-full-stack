import { Request, Response } from "express";
import {
  getCartItems as fetchCartItems,
  updateCartItemQuantity as modifyCartItemQuantity,
  deleteCartItem as removeCartItem,
} from "../services/cart.service.js";
import { updateCartItemRequestSchema } from "../schemas/cart.schema.js";
import { UpdateCartItemDto, UpdateResultKey } from "../../interfaces/cart.interface.js";
import { ERROR_RESPONSE } from "../constants/error.js";

export async function getCartItems(_request: Request, response: Response): Promise<void> {
  const cartItemList = await fetchCartItems();
  response.status(200).json(cartItemList);
  return;
}

const ERROR_BY_RESULT: Record<UpdateResultKey, number> = {
  CART_ITEM_NOT_FOUND: 404,
  PRODUCT_NOT_FOUND: 404,
  OUT_OF_STOCK: 409,
};

export async function updateCartItemQuantity(request: Request, response: Response) {
  const id = Number(request.params.id);
  const { quantity }: UpdateCartItemDto = updateCartItemRequestSchema.parse(request.body);
  const result = await modifyCartItemQuantity(id, quantity);
  if (result !== "SUCCESS") {
    response.status(ERROR_BY_RESULT[result]).json(ERROR_RESPONSE[result]);
    return;
  }
  response.status(204).end();
}

export async function deleteCartItem(request: Request, response: Response): Promise<void> {
  const id = Number(request.params.id);
  const deleted = await removeCartItem(id);
  if (deleted) {
    response.status(204).end();
    return;
  }
  response.status(404).json(ERROR_RESPONSE.CART_ITEM_NOT_FOUND);
}
