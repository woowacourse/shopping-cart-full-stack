import express from "express";
import { getProducts } from "./products.controller";

export const productsRouter = express.Router();

productsRouter.get("/", getProducts);
