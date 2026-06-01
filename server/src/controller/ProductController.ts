import { Request, Response } from "express";
import { handleError } from "./ErrorHandler";
import ProductService from "../service/ProductService";

export default class ProductController {
  #productService: ProductService;

  constructor(productService: ProductService) {
    this.#productService = productService;
  }
  
  #runPostProducts = (request: Request, response: Response): void => {
    const newProducts = request.body;
    const addedProduct = this.#productService.postProducts(newProducts);
    response.status(201).json(addedProduct);
  };
  
  #runDeleteProducts = (request: Request, response: Response): void => {
    const productId = Number(request.params.productId);
    this.#productService.deleteProducts(productId);
    response.status(204).send();
  };

  getProducts = (_request: Request, response: Response): void => {
    const products = this.#productService.getProducts();
    response.status(200).json(products);
  };
  
  postProducts = (request: Request, response: Response): void => {
    try {
      this.#runPostProducts(request, response);
    } catch (error) {
      handleError(response, error);
    }
  };
  
  deleteProducts = (request: Request, response: Response): void => {
    try {
      this.#runDeleteProducts(request, response);
    } catch (error) {
      handleError(response, error);
    }
  };
}
