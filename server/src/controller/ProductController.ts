import { Request, Response } from "express";
import { handleError } from "./ErrorHandler";
import {
  deleteProductsService,
  getProductsService,
  postProductsService,
} from "../service/ProductService";

const getProducts = (_request: Request, response: Response): void => {
  try {
    const products = getProductsService();
    response.status(200).json(products);
  } catch (error) {
    handleError(response, error);
  }
};

const postProducts = (request: Request, response: Response): void => {
  try {
    const newProducts = request.body;
    const addedProduct = postProductsService(newProducts);
    response.status(201).json(addedProduct);
  } catch (error) {
    handleError(response, error);
  }
};

const deleteProducts = (request: Request, response: Response): void => {
  try {
    const productId = Number(request.params.productId);
    deleteProductsService(productId);
    response.status(204).send();
  } catch (error) {
    handleError(response, error);
  }
};

export default { getProducts, postProducts, deleteProducts };
