import express from "express";
import { productsRouter } from "./modules/products/products.route";
import { cartsRouter } from "./modules/carts/carts.route";
import { ordersRouter } from "./modules/orders/orders.route";
import { couponsRouter } from "./modules/coupons/coupons.route";
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
app.use("/order", ordersRouter);
app.use("/coupons", couponsRouter);
app.use(errorHandler);

export default app;
