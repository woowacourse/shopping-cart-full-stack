import { NextFunction, Request, Response } from "express";
import ProductService from "./product.service.js";

class ProductController {
  constructor(private productService: ProductService) {}

  addProduct = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, imgUrl, quantity } = req.body;

      const id = this.productService.addProduct({
        name,
        price,
        imgUrl,
        quantity,
      });

      res.status(201).json({
        message: "성공적으로 생성되었습니다.",
        result: { id },
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id;

      this.productService.deleteProduct(Number(productId));

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getProducts = (_req: Request, res: Response, next: NextFunction) => {
    try {
      const products = this.productService.getProducts();

      res.status(200).json({
        code: 200,
        message: "요청에 성공했습니다.",
        result: { products },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductController;
