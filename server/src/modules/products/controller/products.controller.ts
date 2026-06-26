import { RequestHandler } from "express";
import { validateID, validateProduct } from "../schema/products.schema";
import { ProductsService } from "../service/products.service";

export class ProductsController {
  constructor(private productsService: ProductsService) {}

  getProducts: RequestHandler = (_, res) => {
    const products = this.productsService.getAllProducts();

    res.status(200).json({
      status: "success",
      message: "상품 목록을 정상적으로 조회하였습니다.",
      data: products,
    });
  };

  addProduct: RequestHandler = (req, res) => {
    const body = validateProduct(req.body);

    const product = this.productsService.addProduct(body);

    res.status(201).json({
      status: "success",
      message: "상품을 정상적으로 등록하였습니다.",
      data: product,
    });
  };

  deleteProduct: RequestHandler = (req, res) => {
    const id = validateID(req.params.id);

    const product = this.productsService.deleteProduct(id);

    res.status(200).json({
      status: "success",
      message: "상품을 정상적으로 삭제하였습니다.",
      data: { id: product },
    });
  };
}
