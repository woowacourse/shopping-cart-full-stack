import express from "express";
import ProductService from "./domain/product/product.service.js";
import { InMemoryProductRepository } from "./domain/product/product.repository.js";
import { InMemoryCartRepository } from "./domain/cart/cart.repository.js";
import CartService from "./domain/cart/cart.service.js";
import ProductController from "./controllers/product.controller.js";
import CartController from "./controllers/cart.controller.js";
import createProductRouter from "./routes/product.routes.js";
import createCartRouter from "./routes/cart.routes.js";

const inMemoryProductRepository = new InMemoryProductRepository();
const inMemoryCartRepository = new InMemoryCartRepository();

const productService = new ProductService(
  inMemoryProductRepository,
  inMemoryCartRepository,
);
const cartService = new CartService(
  inMemoryCartRepository,
  inMemoryProductRepository,
);
const productController = new ProductController(productService);
const cartController = new CartController(cartService);
const productRouter = createProductRouter(productController);
const cartRouter = createCartRouter(cartController);

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/products", productRouter);
app.use("/carts", cartRouter);

export default app;

export const resetApp = () => {
  productService.reset();
  cartService.reset();
};
