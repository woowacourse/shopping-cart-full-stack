import { Router } from "express";

import cartsRouter from "../modules/carts/carts.router.ts";
import productsRouter from "../modules/products/products.router.ts";

const router = Router();

router.use("/carts", cartsRouter);
router.use("/products", productsRouter);

export default router;
