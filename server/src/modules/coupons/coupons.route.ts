import express from "express";
import { couponsController } from "./coupons.module";

export const couponsRouter = express.Router();

couponsRouter.get("/", couponsController.getCoupons);
