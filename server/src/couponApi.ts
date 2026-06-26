import { Router } from "express";
import {
  getAllCoupons,
  calculateCoupons,
  validateCoupons,
} from "./service/couponService.ts";
import { BadRequestError } from "./error.ts";
import type { CalculationItem } from "./types/type.ts";

const router = Router();

router.get("/", (_req, res, next) => {
  try {
    res.status(200).send({ coupons: getAllCoupons() });
  } catch (error) {
    next(error);
  }
});

router.post("/calculation", (req, res, next) => {
  try {
    const items = parseItems(req.body?.items);
    const couponIds = parseCouponIds(req.body?.couponIds);
    const isRemoteArea = parseBoolean(req.body?.isRemoteArea, "isRemoteArea");

    res.status(200).send(calculateCoupons({ items, couponIds, isRemoteArea }));
  } catch (error) {
    next(error);
  }
});

router.post("/validation", (req, res, next) => {
  try {
    const couponIds = parseCouponIds(req.body?.couponIds);
    validateCoupons(couponIds);

    res.status(200).send({ message: "올바른 쿠폰입니다." });
  } catch (error) {
    next(error);
  }
});

function parseItems(value: unknown): CalculationItem[] {
  if (!Array.isArray(value)) {
    throw new BadRequestError({
      code: "INVALID_ITEMS",
      message: "상품 정보 형식이 올바르지 않습니다.",
      field: "items",
    });
  }

  return value.map((item) => {
    if (
      typeof item?.price !== "number" ||
      typeof item?.quantity !== "number"
    ) {
      throw new BadRequestError({
        code: "INVALID_ITEMS",
        message: "상품 정보 형식이 올바르지 않습니다.",
        field: "items",
      });
    }
    return { price: item.price, quantity: item.quantity };
  });
}

function parseCouponIds(value: unknown): number[] {
  if (!Array.isArray(value) || value.some((id) => typeof id !== "number")) {
    throw new BadRequestError({
      code: "INVALID_COUPON_ID",
      message: "쿠폰 정보 형식이 올바르지 않습니다.",
      field: "couponIds",
    });
  }
  return value;
}

function parseBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") {
    throw new BadRequestError({
      code: "INVALID_TYPE",
      message: "요청 형식이 올바르지 않습니다.",
      field,
    });
  }
  return value;
}

export default router;
