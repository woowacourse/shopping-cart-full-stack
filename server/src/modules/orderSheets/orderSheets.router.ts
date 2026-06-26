import { Router } from "express";

import * as orderSheetsController from "./orderSheets.controller.ts";

const orderSheetsRouter = Router();

orderSheetsRouter.get(
  "/:orderSheetId",
  orderSheetsController.getOrderSheetById,
);

orderSheetsRouter.post("/:cartId", orderSheetsController.createOrderSheet);

orderSheetsRouter.get(
  "/:orderSheetId/pricing",
  orderSheetsController.getOrderSheetPricing,
);

orderSheetsRouter.patch(
  "/:orderSheetId/shipping-area",
  orderSheetsController.patchOrderSheetShippingArea,
);

orderSheetsRouter.get(
  "/:orderSheetId/able-coupons",
  orderSheetsController.getOrderSheetAbleCoupons,
);

orderSheetsRouter.post(
  "/:orderSheetId/coupon-discount-preview",
  orderSheetsController.postOrderSheetCouponDiscountPreview,
);

orderSheetsRouter.patch(
  "/:orderSheetId/coupons",
  orderSheetsController.patchOrderSheetCoupons,
);

export default orderSheetsRouter;
