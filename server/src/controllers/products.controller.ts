import { CreateProductDto } from "../../interfaces/product.interface.js";
import { Request, Response } from "express";
import { addProduct } from "../services/products.service.js";
import { createProductRequestSchema } from "../schemas/product.schema.js";

export async function createProduct(
  request: Request,
  response: Response,
): Promise<void> {
  const dto: CreateProductDto = createProductRequestSchema.parse(request.body);
  await addProduct(dto);
  response.status(201).end();
}
