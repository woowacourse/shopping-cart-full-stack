import { CreateProductDto } from "../interfaces/product.interface.js";
import { Request, Response } from "express";
import {
  addProduct,
  getProducts as fetchProducts,
  deleteProduct as removeProduct,
} from "../services/products.service.js";
import { createProductRequestSchema } from "../schemas/product.schema.js";
import { ERROR_RESPONSE } from "../constants/error.js";

export async function createProduct(request: Request, response: Response): Promise<void> {
  const dto: CreateProductDto = createProductRequestSchema.parse(request.body);
  await addProduct(dto);
  response.status(201).end();
}

export async function getProducts(_request: Request, response: Response): Promise<void> {
  const productList = await fetchProducts();
  response.status(200).json(productList);
  return;
}

export async function deleteProduct(request: Request, response: Response): Promise<void> {
  const id = Number(request.params.id);
  const deleted = await removeProduct(id);
  if (deleted) {
    response.status(204).end();
    return;
  }
  response.status(404).json(ERROR_RESPONSE.PRODUCT_NOT_FOUND);
}
