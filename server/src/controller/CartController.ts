import { Request, Response } from "express";
import {
  getCartItemsService,
  deleteCartItemService,
  postCartItemService,
  patchCartItemService,
} from "../service/CartService";

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
    //   if (error instanceof Error) {
    //     return response.status(400).json({ message: "잘못된 요청 형식입니다." });
    //   }
    //   return response
    //     .status(500)
    //     .json({ message: "네트워크 에러가 발생했습니다!" });
  }
};

const deleteCartItem = (request: Request, response: Response): void => {
  try {
    runDeleteCartItem(request, response);
  } catch (error) {
    handleError(response, error);
    response.status(500).json({ message: "네트워크 에러가 발생했습니다!" });
  }
};

const patchCartItem = (request: Request, response: Response): void => {
  try {
    runPatchCartItem(request, response);
  } catch (error) {
    handleError(response, error);
    // if (error instanceof Error) {
    //   response.status(400).json({ message: "잘못된 요청 형식입니다." });
    // }
    // response
    //   .status(500)
    //   .json({ message: "네트워크 에러가 발생했습니다!" });
  }
};

export default { getCartItems, postCartItem, deleteCartItem, patchCartItem };
