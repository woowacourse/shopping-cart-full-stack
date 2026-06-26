import express from "express";
import cors from "cors";
import { ProductRepositoryInterface } from "./repositories/interfaces/ProductRepositoryInterface";
import { CartRepositoryInterface } from "./repositories/interfaces/CartRepositoryInterface";
import ProductService from "./service/ProductService";
import CartService from "./service/CartService";
import ProductController from "./controller/ProductController";
import CartController from "./controller/CartController";
import { createCartRouter } from "./routes/CartRouter";
import { createProductRouter } from "./routes/ProductRouter";
import { CouponRepositoryInterface } from "./repositories/interfaces/CouponRepositoryInterface";
import { OrderRepositoryInterface } from "./repositories/interfaces/OrderRepositoryInterface";
import { PreorderRepositoryInterface } from "./repositories/interfaces/PreorderRepositoryInterface";
import CouponService from "./service/CouponService";
import PreorderService from "./service/PreorderService";
import OrderService from "./service/OrderService";
import { createCouponRouter } from "./routes/CouponRouter";
import CouponController from "./controller/CouponController";
import { createPreorderRouter } from "./routes/PreorderRouter";
import PreorderController from "./controller/PreorderController";
import { createOrderRouter } from "./routes/OrderRouter";
import OrderController from "./controller/OrderController";

interface Repositories {
  productRepo: ProductRepositoryInterface;
  cartRepo: CartRepositoryInterface;
  couponRepo: CouponRepositoryInterface;
  orderRepo: OrderRepositoryInterface;
  preorderRepo: PreorderRepositoryInterface;
}

export const runApp = (repositories: Repositories): express.Express => {
  const app = express();

  const corsOptions = {
    origin: [
      "http://localhost:5173",
      "https://shopping-cart-full-stack-binggwa.up.railway.app",
      "https://shopping-cart-full-stack-psi.vercel.app",
    ],
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  const productService = new ProductService(
    repositories.productRepo,
    repositories.cartRepo,
  );
  const cartService = new CartService(
    repositories.productRepo,
    repositories.cartRepo,
  );
  const couponService = new CouponService(repositories.couponRepo);
  const preorderService = new PreorderService(
    repositories.cartRepo,
    repositories.productRepo,
    repositories.preorderRepo,
  );
  const orderService = new OrderService(
    repositories.productRepo,
    repositories.couponRepo,
    repositories.orderRepo,
    repositories.cartRepo,
    repositories.preorderRepo,
  );

  app.use("/cart", createCartRouter(new CartController(cartService)));
  app.use(
    "/products",
    createProductRouter(new ProductController(productService)),
  );
  app.use("/coupons", createCouponRouter(new CouponController(couponService)));
  app.use(
    "/preorder",
    createPreorderRouter(new PreorderController(preorderService)),
  );
  app.use("/orders", createOrderRouter(new OrderController(orderService)));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
};
