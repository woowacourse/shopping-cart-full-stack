import express from "express";
import { addProduct, getProducts } from "./products.controller";

export const productsRouter = express.Router();

productsRouter.get("/", getProducts);
productsRouter.post("/", addProduct);
