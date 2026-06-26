import { Router } from "express";
import {
  productBodyValidateMiddelware,
  cartBodyValidateMiddelware,
  tempOrderBodyValidateMiddleware,
  discountSummaryBodyValidateMiddleware,
} from "./middlewares/BodyValiadateMiddleware.js";
import {
  ProductController,
  CartController,
  TempOrderController,
  CouponController,
  DiscountSummaryController,
} from "./controllers.js";

export function createShopRouter({
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
  const router = Router();

  router
    .route("/api/products/")
    .get(productController.get)
    .post(productBodyValidateMiddelware, productController.add);

  router.route("/api/products/:id/").delete(productController.delete);

  router.route("/api/cart/").get(cartController.get);

  router
    .route("/api/cart/items/:id/")
    .patch(cartBodyValidateMiddelware, cartController.update)
    .delete(cartController.delete);

  router.route("/api/orders/").post(tempOrderController.post);
  router
    .route("/api/orders/:id/")
    .get(tempOrderController.get)
    .patch(tempOrderBodyValidateMiddleware, tempOrderController.patch);

  router
    .route("/api/orders/:id/discount-summary/")
    .post(
      discountSummaryBodyValidateMiddleware,
      discountSummaryController.post,
    );

  router.route("/api/orders/:id/coupons/").get(couponController.get);

  return router;
}
