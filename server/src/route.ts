import express from "express";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  ProductController,
  CartController,
  TempOrderController,
  CouponController,
  DiscountSummaryController,
} from "./shop/controllers.js";
import { createShopRouter } from "./shop/route.js";
import { handleErrors } from "./errors.js";

export function createApp({
  productController,
  cartController,
  tempOrderController,
  discountSummaryController,
  couponController,
}: {
  productController: ProductController;
  cartController: CartController;
  tempOrderController: TempOrderController;
  discountSummaryController: DiscountSummaryController;
  couponController: CouponController;
}) {
  const app = express();
  const router = app.router;

  const __dirname = dirname(fileURLToPath(import.meta.url));
  router.use(express.json());
  router.use(
    cors({
      origin: ["http://localhost:5173", "https://antoliny0919.github.io"],
      methods: ["GET", "PATCH", "DELETE", "POST"],
    }),
  );
  router.use(express.static(join(__dirname, "../public/images")));
  router.use(
    createShopRouter({
      productController,
      cartController,
      tempOrderController,
      discountSummaryController,
      couponController,
    }),
  );

  router.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      handleErrors(res, err);
    },
  );

  return app;
}
