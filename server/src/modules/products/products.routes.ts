import express from "express";
import { addProduct, deleteProduct, getProducts } from "./products.controller";

export const productsRouter = express.Router();

productsRouter.get("/", getProducts);
productsRouter.post("/", addProduct);
productsRouter.delete("/:id", deleteProduct);
