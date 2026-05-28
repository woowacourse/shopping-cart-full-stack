import { Router } from "express";

import * as productsController from "./products.controller.ts";

const productsRouter = Router();

productsRouter.get("/", productsController.getProducts);
productsRouter.post("/", productsController.createProduct);
productsRouter.delete("/:id", productsController.deleteProduct);

export default productsRouter;
