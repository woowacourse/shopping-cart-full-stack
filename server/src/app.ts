import express from "express";
import { productsRouter } from "./modules/products/products.routes";
import { cartsRouter } from "./modules/carts/carts.routes";
import errorHandler from "./middlewares/errorHandler";
import cors from "./middlewares/cors";

const app = express();

app.use(cors);
app.use(express.json());
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use(errorHandler);

export default app;
