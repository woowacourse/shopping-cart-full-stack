import type { Request, Response } from "express";

import { success } from "../../common/response.ts";
import * as productsService from "./products.service.ts";

export const getProducts = (_req: Request, res: Response) => {
  const products = productsService.getProducts();

  return success(res, products);
};

export const createProduct = (req: Request, res: Response) => {
  const newProduct = req.body;
  const product = productsService.createProduct(newProduct);

  return success(res, product);
};
