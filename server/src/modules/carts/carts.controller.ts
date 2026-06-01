import type { Request, Response } from "express";

import { ServiceError } from "../../common/error.ts";
import { fail, success } from "../../common/response.ts";
import * as cartsService from "./carts.service.ts";
import type { UpdateCartItemQuantityRequest } from "./carts.dto.ts";

const getStatusCode = (error: ServiceError<unknown>) => {
  if (error.errorCode === "RESOURCE_NOT_FOUND") return 404;

  return 400;
};

export const getCartById = (req: Request, res: Response) => {
  const cartId = Number(req.params.cartId);

  try {
    const cart = cartsService.getCartById(cartId);

    return success(res, cart);
  } catch (error) {
    if (error instanceof ServiceError) {
      return fail(res, error.errorCode, error.errorMessage, 404, error.data);
    }

    throw error;
  }
};

export const updateCartProduct = (req: Request, res: Response) => {
  const cartId = Number(req.params.cartId);
  const productId = Number(req.params.productId);

  const body = req.body as UpdateCartItemQuantityRequest;

  try {
    const product = cartsService.updateCartProduct(cartId, productId, body);

    return success(res, product);
  } catch (error) {
    if (error instanceof ServiceError) {
      return fail(
        res,
        error.errorCode,
        error.errorMessage,
        getStatusCode(error),
        error.data,
      );
    }

    throw error;
  }
};

export const deleteCartProduct = (req: Request, res: Response) => {
  const cartId = Number(req.params.cartId);
  const productId = Number(req.params.productId);

  try {
    cartsService.deleteCartProduct(cartId, productId);

    return res.status(204).send();
  } catch (error) {
    if (error instanceof ServiceError) {
      return fail(res, error.errorCode, error.errorMessage, 404, error.data);
    }

    throw error;
  }
};
