import express from "express";
import { productsRouter } from "./modules/products/products.routes";
import { cartsRouter } from "./modules/carts/carts.routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json());
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use(errorHandler);

export default app;
