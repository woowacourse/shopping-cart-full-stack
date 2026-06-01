import express from "express";
import type { Express } from "express";
import ProductService from "./modules/product/product.service.js";
import { InMemoryProductRepository } from "./modules/product/product.repository.js";
import { InMemoryCartRepository } from "./modules/cart/cart.repository.js";
import CartService from "./modules/cart/cart.service.js";
import ProductController from "./modules/product/product.controller.js";
import CartController from "./modules/cart/cart.controller.js";
import createProductRouter from "./modules/product/product.routes.js";
import createCartRouter from "./modules/cart/cart.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const createApp = (): Express => {
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
  app.use(errorMiddleware);

  return app;
};

export default createApp;
