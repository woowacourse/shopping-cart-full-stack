import { Router } from "express";

import cartsRouter from "../modules/carts/carts.router.ts";
import productsRouter from "../modules/products/products.router.ts";
import shippingFeeRouter from "../modules/shippingFee/shippingFee.router.ts";
import couponsRouter from "../modules/coupons/coupons.router.ts";
import orderSheetsRouter from "../modules/orderSheets/orderSheets.router.ts";

const router = Router();

router.use("/carts", cartsRouter);
router.use("/products", productsRouter);
router.use("/shipping-fee", shippingFeeRouter);
router.use("/coupons", couponsRouter);
router.use("/order-sheet", orderSheetsRouter);

export default router;
