import type { Request, Response } from "express";

import { success } from "../../common/response.js";
import * as productsService from "./products.service.js";

export const getProducts = (_req: Request, res: Response) => {
  const products = productsService.getProducts();

  return success(res, products);
};
