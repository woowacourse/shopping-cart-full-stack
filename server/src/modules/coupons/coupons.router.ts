import { Router } from "express";

import * as couponsController from "./coupons.controller.ts";

const couponsRouter = Router();

couponsRouter.get("/", couponsController.getCoupons);

export default couponsRouter;
