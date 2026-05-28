import type { Request, Response } from "express";

import { BadRequestError } from "../../common/error.ts";
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

    return success(res, product);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return fail(res, error.errorCode, error.errorMessage, 400, error.data);
    }

    throw error;
  }
};
