import Product from "./product.js";
import { Request, Response } from "express";
import type ProductService from "./product.service.js";
import type DeleteProductUseCase from "./delete-product.usecase.js";
import { BadRequestError } from "../../errors/http-error.js";

export default class ProductController {
  constructor(
    private productService: ProductService,
    private deleteProductUseCase: DeleteProductUseCase,
  ) {}

  getProductAll = async (req: Request, res: Response) => {
    const products = await this.productService.getAll();

    res.status(200).json({
      result: "success",
      data: {
        products,
      },
    });
  };

  getProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const numberId = Number(productId);
    if (Number.isNaN(numberId)) {
      throw new BadRequestError("상품 id 형식이 올바르지 않습니다.");
    }

    const product = await this.productService.getById(numberId);
    res.status(200).json({
      result: "success",
      data: {
        ...product,
      },
    });
  };

  addProduct = async (req: Request, res: Response) => {
    const { name, price, imgUrl } = req.body;
    if (name === undefined || price === undefined) {
      throw new BadRequestError("필수 필드 값이 누락되었습니다.");
    }
    await this.productService.register({ name, price, imgUrl });
    res.status(201).json();
  };

  removeProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const numberId = Number(productId);

    if (Number.isNaN(numberId)) {
      throw new BadRequestError("상품 id 형식이 올바르지 않습니다.");
    }
    await this.deleteProductUseCase.execute(numberId);
    res.status(204).json();
  };
}
