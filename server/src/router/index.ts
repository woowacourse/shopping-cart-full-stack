import { Router } from "express";

import cartsRouter from "../modules/carts/carts.router.ts";
import productsRouter from "../modules/products/products.router.ts";
import ordersRouter from "../modules/orders/orders.router.ts";

const router = Router();

router.use("/carts", cartsRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);

export default router;
