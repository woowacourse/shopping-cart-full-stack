import { Router } from "express";

import * as productsController from "./products.controller.js";

const productsRouter = Router();

productsRouter.get("/", productsController.getProducts);

export default productsRouter;
