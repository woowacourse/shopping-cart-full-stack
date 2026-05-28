import { Request, Response } from "express";
import { handleError } from "./ErrorHandler";
import { deleteProductsService, getProductsService, postProductsService } from "../service/ProductService";

const getProducts = (_request: Request, response: Response): void => {
  const products = getProductsService();
  response.status(200).json(products);
};

const runPostProducts = (request: Request, response: Response): void => {
  const newProducts = request.body;
  const addedProduct = postProductsService(newProducts);
  response.status(201).json(addedProduct);
};

const runDeleteProducts = (request: Request, response: Response): void => {
  const productId = Number(request.params.productId);
  deleteProductsService(productId);
  response.status(204).send();
};

const postProducts = (request: Request, response: Response): void => {
  try {
    runPostProducts(request, response);
  } catch (error) {
    handleError(response, error);
  }
};

const deleteProducts = (request: Request, response: Response): void => {
  try {
    runDeleteProducts(request, response);
  } catch (error) {
    handleError(response, error);
  }
};

export default { getProducts, postProducts, deleteProducts };
