import { InMemoryProductRepository } from "./repository/products.repository";
import { ProductsController } from "./controller/products.controller";
import { ProductsService } from "./service/products.service";
import { cartsService } from "../carts/carts.module";

export const productsRepository = new InMemoryProductRepository();

export const productsService = new ProductsService(
  productsRepository,
  cartsService,
);

export const productsController = new ProductsController(productsService);
