import { Request, Response, NextFunction } from 'express';
import * as productsService from '../services/ProductsService.js';
import { success } from '../response.js';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productsService.getProducts();
    success(res, { products }, 200);
  } catch (error) {
    next(error);
  }
};

export const postProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productsService.insertProduct(req.body);
    success(res, product, 201);
  } catch (error) {
    next(error);
  }
};

export const deleteProducts = async (
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const deleted = await productsService.deleteProduct(productId);
    success(res, { id: deleted.id }, 200);
  } catch (error) {
    next(error);
  }
};
