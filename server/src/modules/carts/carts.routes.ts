import express from "express";
import { getCarts } from "./carts.controller";

export const cartsRouter = express.Router();

cartsRouter.get("/", getCarts);
