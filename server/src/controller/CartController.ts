import { Request, Response } from "express";
import {
  getCartItemsService,
  deleteCartItemService,
  postCartItemService,
  patchCartItemService,
} from "../service/CartService";
import { handleError } from "./ErrorHandler";

const getCartItems = (_request: Request, response: Response): void => {
  const cartItems = getCartItemsService();
  response.status(200).json(cartItems);
};

const runPostCartItem = (request: Request, response: Response): void => {
  const { productId, quantity } = request.body;
  const addedCartItem = postCartItemService(Number(productId), Number(quantity));
  response.status(201).json(addedCartItem);
};

const runDeleteCartItem = (request: Request, response: Response): void => {
  const cartItemId = Number(request.params.cartItemId);
  deleteCartItemService(cartItemId);
  response.status(204).send();
};

const runPatchCartItem = (request: Request, response: Response): void => {
  const cartItemId = Number(request.params.cartItemId);
  const newQuantity = Number(request.body.quantity);
  const patchedCartItem = patchCartItemService(cartItemId, newQuantity);
  response.status(200).json(patchedCartItem);
};

const postCartItem = (request: Request, response: Response): void => {
  try {
    runPostCartItem(request, response);
  } catch (error) {
    handleError(response, error);
  }
};

const deleteCartItem = (request: Request, response: Response): void => {
  try {
    runDeleteCartItem(request, response);
  } catch (error) {
    handleError(response, error);
  }
};

const patchCartItem = (request: Request, response: Response): void => {
  try {
    runPatchCartItem(request, response);
  } catch (error) {
    handleError(response, error);
  }
};

export default { getCartItems, postCartItem, deleteCartItem, patchCartItem };
