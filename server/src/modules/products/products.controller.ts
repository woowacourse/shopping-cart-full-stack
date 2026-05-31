import type { Request, Response } from "express";

import { ServiceError } from "../../common/error.ts";
import { fail, success } from "../../common/response.ts";
import * as productsService from "./products.service.ts";

export const getProducts = (_req: Request, res: Response) => {
  const products = productsService.getProducts();

  return success(res, products);
};

export const createProduct = (req: Request, res: Response) => {
  const newProduct = req.body;

  try {
    const product = productsService.createProduct(newProduct);

    return success(res, product, 201);
  } catch (error) {
    if (error instanceof ServiceError) {
      return fail(res, error.errorCode, error.errorMessage, 400, error.data);
    }

    throw error;
  }
};

export const deleteProduct = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    productsService.deleteProduct(id);

    return success(res, null, 204);
  } catch (error) {
    if (error instanceof ServiceError) {
      return fail(res, error.errorCode, error.errorMessage, 404, error.data);
    }

    throw error;
  }
};
