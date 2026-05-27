import { Request, Response } from 'express';
import ProductsService from '../services/ProductsService';
import { InsertProductRequestBodySchema } from './../schemas';
import { ZodError } from 'zod';

class ProductsController {
  service;

  constructor() {
    this.service = new ProductsService();
  }

  getProducts = async (_req: Request, res: Response) => {
    try {
      const products = await this.service.getProducts();
      res.status(200).json({
        status: 'success',
        data: products,
      });
    } catch {
      res.status(500).json({
        status: 'error',
        data: '상품 목록을 가져오는 중 에러가 발생했습니다.',
      });
    }
  };

  postProducts = async (req: Request, res: Response) => {
    try {
      const parsedBody = InsertProductRequestBodySchema.parse(req.body);

      const product = await this.service.insertProduct(parsedBody);
      res.status(201).json({
        status: 'success',
        data: product,
      });
    } catch (error: unknown) {
      // TODO: zod 에러 잡기
      if (error instanceof ZodError) {
        const { fieldErrors } = error.flatten();

        res.status(400).json({
          status: 'fail',
          data: fieldErrors,
        });
      }
      res.status(500).json({
        status: 'error',
        data: '상품을 추가하는 중 에러가 발생했습니다.',
      });
    }
  };
}

export default ProductsController;
