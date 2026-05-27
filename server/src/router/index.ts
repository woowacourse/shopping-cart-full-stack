import { Router } from "express";

import productsRouter from "../modules/products/products.router.ts";

const router = Router();

router.use("/products", productsRouter);

export default router;
