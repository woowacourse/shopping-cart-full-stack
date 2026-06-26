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
import { InMemoryCheckoutRepository } from "./modules/checkout/checkout.repository.js";
import CheckoutService from "./modules/checkout/checkout.service.js";
import { InMemoryCouponRepository } from "./modules/coupon/coupon.repository.js";
import CouponService from "./modules/coupon/coupon.service.js";
import CheckoutController from "./modules/checkout/checkout.controller.js";
import createCheckoutRouter from "./modules/checkout/checkout.routes.js";

const ALLOWED_ORIGINS = new Set([
  "https://jebiyeon02.github.io",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3030",
  "http://127.0.0.1:3030",
]);

const createApp = (): Express => {
  const inMemoryProductRepository = new InMemoryProductRepository();
  const inMemoryCartRepository = new InMemoryCartRepository();
  const inMemoryCouponRepository = new InMemoryCouponRepository();
  const inMemoryCheckoutRepository = new InMemoryCheckoutRepository();

  const productService = new ProductService(
    inMemoryProductRepository,
    inMemoryCartRepository,
  );
  const cartService = new CartService(
    inMemoryCartRepository,
    inMemoryProductRepository,
  );
  const couponService = new CouponService(inMemoryCouponRepository);
  const checkoutService = new CheckoutService(
    inMemoryCheckoutRepository,
    cartService,
    couponService,
  );

  const productController = new ProductController(productService);
  const cartController = new CartController(cartService);
  const checkoutController = new CheckoutController(checkoutService);

  const productRouter = createProductRouter(productController);
  const cartRouter = createCartRouter(cartController);
  const checkoutRouter = createCheckoutRouter(checkoutController);

  couponService.createBaseCoupon(); // 기본 쿠폰 4개 생성
  const app = express();

  app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && ALLOWED_ORIGINS.has(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS",
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }

    next();
  });

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/products", productRouter);
  app.use("/carts", cartRouter);
  app.use("/checkout", checkoutRouter);
  app.use(errorMiddleware);

  return app;
};

export default createApp;
