import { Request, Response } from "express";
import {
  getCartItemsService,
  deleteCartItemService,
  postCartItemService,
  patchCartItemService,
} from "../service/CartService";
import { handleError } from "./ErrorHandler";

const getCartItems = (_request: Request, response: Response): void => {
  try {
    const cartItems = getCartItemsService();
    response.status(200).json(cartItems);
  } catch (error) {
    handleError(response, error);
  }
};

const postCartItem = (request: Request, response: Response): void => {
  try {
    const { productId, quantity } = request.body;
    const addedCartItem = postCartItemService(
      Number(productId),
      Number(quantity),
    );
    response.status(201).json(addedCartItem);
  } catch (error) {
    handleError(response, error);
  }
};

const deleteCartItem = (request: Request, response: Response): void => {
  try {
    const cartItemId = Number(request.params.cartItemId);
    deleteCartItemService(cartItemId);
    response.status(204).send();
  } catch (error) {
    handleError(response, error);
  }
};

const patchCartItem = (request: Request, response: Response): void => {
  try {
    const cartItemId = Number(request.params.cartItemId);
    const newQuantity = Number(request.body.quantity);
    const patchedCartItem = patchCartItemService(cartItemId, newQuantity);
    response.status(200).json(patchedCartItem);
  } catch (error) {
    handleError(response, error);
  }
};

export default { getCartItems, postCartItem, deleteCartItem, patchCartItem };
