import express from "express";
import { productsRouter } from "./modules/products/products.routes";

const app = express();
app.use(express.json());
app.use("/products", productsRouter);

export default app;
