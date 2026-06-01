import express from "express";
import cors from 'cors';
import { ProductRepositoryInterface } from "./repositories/interfaces/ProductRepositoryInterface";
import { CartRepositoryInterface } from "./repositories/interfaces/CartRepositoryInterface";
import ProductService from "./service/ProductService";
import CartService from "./service/CartService";
import ProductController from "./controller/ProductController";
import CartController from "./controller/CartController";
import { createCartRouter } from "./routes/CartRouter";
import { createProductRouter } from "./routes/ProductRouter";

interface Repositories {
  productRepo: ProductRepositoryInterface;
  cartRepo: CartRepositoryInterface;
}

export const runApp = (repositories: Repositories): express.Express => {
  const app = express();
  
  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
  };
  
  app.use(cors(corsOptions));
  app.use(express.json());

  const productService = new ProductService(repositories.productRepo, repositories.cartRepo);
  const cartService = new CartService(repositories.productRepo, repositories.cartRepo);

  app.use("/cart", createCartRouter(new CartController(cartService)));
  app.use("/products", createProductRouter(new ProductController(productService)));
  
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}
