import express from "express";
import { productsController } from "./products.module";

export const productsRouter = express.Router();

productsRouter.get("/", productsController.getProducts);
productsRouter.post("/", productsController.addProduct);
productsRouter.delete("/:id", productsController.deleteProduct);
