import express from "express";
import { productsRouter } from "./modules/products/products.routes";
import { cartsRouter } from "./modules/carts/carts.routes";

const app = express();
app.use(express.json());
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);

export default app;
