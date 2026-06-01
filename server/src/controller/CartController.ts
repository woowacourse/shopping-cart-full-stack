import { Request, Response } from "express";
import CartService from "../service/CartService";
import { handleError } from "./ErrorHandler";

export default class CartController {
  #cartService: CartService;

  constructor(cartService: CartService) {
    this.#cartService = cartService;
  }
  
  #runPostCartItem = (request: Request, response: Response): void => {
    const { productId, quantity } = request.body;
    const addedCartItem = this.#cartService.postCartItem(Number(productId), Number(quantity));
    response.status(201).json(addedCartItem);
  };
  
  #runDeleteCartItem = (request: Request, response: Response): void => {
    const cartItemId = Number(request.params.cartItemId);
    this.#cartService.deleteCartItem(cartItemId);
    response.status(204).send();
  };
  
  #runPatchCartItem = (request: Request, response: Response): void => {
    const cartItemId = Number(request.params.cartItemId);
    const newQuantity = Number(request.body.quantity);
    const patchedCartItem = this.#cartService.patchCartItem(cartItemId, newQuantity);
    response.status(200).json(patchedCartItem);
  };

  getCartItems = (_request: Request, response: Response): void => {
    const cartItems = this.#cartService.getCartItems();
    response.status(200).json(cartItems);
  };
  
  postCartItem = (request: Request, response: Response): void => {
    try {
      this.#runPostCartItem(request, response);
    } catch (error) {
      handleError(response, error);
    }
  };
  
  deleteCartItem = (request: Request, response: Response): void => {
    try {
      this.#runDeleteCartItem(request, response);
    } catch (error) {
      handleError(response, error);
    }
  };
  
  patchCartItem = (request: Request, response: Response): void => {
    try {
      this.#runPatchCartItem(request, response);
    } catch (error) {
      handleError(response, error);
    }
  };
}
