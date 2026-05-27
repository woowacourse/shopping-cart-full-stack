import { Request, Response } from 'express';
import ProductsService from '../services/ProductsService';

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
}

export default ProductsController;
