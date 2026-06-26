import { Request, Response } from 'express';
import { RESPONSE_MESSAGE } from '../../constants/responseMessage.js';
import ProductAppService from './product.app-service.js';

export default class ProductController {
  constructor(private productAppService: ProductAppService) {}

  getProducts = (_req: Request, res: Response) => {
    const products = this.productAppService.getProducts();

    res.status(200).json({
      message: RESPONSE_MESSAGE.SUCCESS,
      result: { products },
    });
  };

  addProduct = (req: Request, res: Response) => {
    const { name, price, imgUrl, quantity } = req.body;

    const id = this.productAppService.addProduct({
      name,
      price,
      imgUrl,
      quantity,
    });

    res.status(201).json({
      message: RESPONSE_MESSAGE.CREATED,
      result: { id },
    });
  };

  deleteProduct = (req: Request, res: Response) => {
    this.productAppService.deleteProduct(Number(req.params.productId));

    res.status(204).json();
  };
}
