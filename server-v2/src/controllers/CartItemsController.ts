import { Request, Response, NextFunction } from 'express';
import * as cartItemsService from '../services/CartItemsService.js';
import { success } from '../response.js';
import { DUMMY_USER_ID } from '../constants.js';

export const postCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartItem = await cartItemsService.addCartItem(DUMMY_USER_ID, req.body);
    success(res, cartItem, 201);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartItemsService.getCart(DUMMY_USER_ID);
    success(res, cart, 200);
  } catch (error) {
    next(error);
  }
};

export const getCartPayInfo = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const payInfo = await cartItemsService.getCartPayInfo(DUMMY_USER_ID);
    success(res, payInfo, 200);
  } catch (error) {
    next(error);
  }
};

export const patchCartItemSelection = async (
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const result = await cartItemsService.selectCartItem(DUMMY_USER_ID, productId, req.body.checkStatus);
    success(res, result, 200);
  } catch (error) {
    next(error);
  }
};

export const patchAllCartItemsSelection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartItemsService.selectAllCartItems(DUMMY_USER_ID, req.body.checkStatus);
    success(res, cart, 200);
  } catch (error) {
    next(error);
  }
};

export const patchCartItemQuantity = async (
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const cartItem = await cartItemsService.updateCartItemQuantity(
      DUMMY_USER_ID,
      productId,
      req.body.quantity,
    );
    success(res, cartItem, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteCartItem = async (
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const result = await cartItemsService.deleteCartItem(DUMMY_USER_ID, productId);
    success(res, result, 200);
  } catch (error) {
    next(error);
  }
};
