import { Router } from "express";

import * as shippingFeeController from "./shippingFee.controller.ts";

const shippingFeeRouter = Router();

shippingFeeRouter.get("/", shippingFeeController.getShippingFee);

export default shippingFeeRouter;
