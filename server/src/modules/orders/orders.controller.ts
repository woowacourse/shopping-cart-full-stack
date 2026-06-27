import type { Request, Response } from "express";
import * as ordersService from "./orders.service.ts";
import { ServiceError } from "../../common/error.ts";
import { fail, success } from "../../common/response.ts";

export const createOrder = (req: Request, res: Response) => {
  try {
    const result = ordersService.createOrder(req.body);
    return success(res, result, 201);
  } catch (error) {
    if (error instanceof ServiceError) {
      if (error.errorCode === "MISSING_FIELD" || error.errorCode === "TYPE_MISMATCH") {
        return fail(res, error.errorCode, error.errorMessage, 400, error.data);
      }
      if (error.errorCode === "OUT_OF_STOCK") {
        return fail(res, error.errorCode, error.errorMessage, 409);
      }
    }
    return fail(res, "INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
  }
};

export const getOrder = (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId as string, 10);
    const result = ordersService.getOrder(orderId);
    return success(res, result);
  } catch (error) {
    if (error instanceof ServiceError) {
      if (error.errorCode === "ORDER_EXPIRED") {
        return fail(res, error.errorCode, error.errorMessage, 409);
      }
      if (error.errorCode === "RESOURCE_NOT_FOUND") {
        return fail(res, error.errorCode, error.errorMessage, 404);
      }
    }
    return fail(res, "INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
  }
};

export const updateOrder = (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId as string, 10);
    const result = ordersService.updateOrder(orderId, req.body);
    return success(res, result);
  } catch (error) {
    if (error instanceof ServiceError) {
      if (error.errorCode === "MISSING_FIELD" || error.errorCode === "TYPE_MISMATCH") {
        return fail(res, error.errorCode, error.errorMessage, 400, error.data);
      }
      if (error.errorCode === "ORDER_EXPIRED") {
        return fail(res, error.errorCode, error.errorMessage, 409);
      }
      if (error.errorCode === "COUPON_EXPIRED") {
        return fail(res, error.errorCode, error.errorMessage, 422);
      }
      if (error.errorCode === "RESOURCE_NOT_FOUND") {
        return fail(res, error.errorCode, error.errorMessage, 404);
      }
    }
    return fail(res, "INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
  }
};

export const getDiscount = (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId as string, 10);
    const couponIdRaw = req.query.couponId;
    let couponIds: number[] = [];
    
    if (couponIdRaw === undefined) {
      return success(res, { discountAmount: 0 });
    }
    
    if (Array.isArray(couponIdRaw)) {
      couponIds = couponIdRaw.map(id => parseInt(id as string, 10));
    } else if (typeof couponIdRaw === "string") {
      couponIds = [parseInt(couponIdRaw, 10)];
    }

    const result = ordersService.getDiscount(orderId, couponIds);
    return success(res, result);
  } catch (error) {
    if (error instanceof ServiceError) {
      if (error.errorCode === "TYPE_MISMATCH") {
        return fail(res, error.errorCode, error.errorMessage, 400);
      }
      if (error.errorCode === "RESOURCE_NOT_FOUND") {
        return fail(res, error.errorCode, error.errorMessage, 404);
      }
    }
    return fail(res, "INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
  }
};

export const getCoupons = (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.orderId as string, 10);
    const result = ordersService.getCoupons(orderId);
    return success(res, result);
  } catch (error) {
    if (error instanceof ServiceError) {
      if (error.errorCode === "RESOURCE_NOT_FOUND") {
        return fail(res, error.errorCode, error.errorMessage, 404);
      }
    }
    return fail(res, "INTERNAL_SERVER_ERROR", "Internal Server Error", 500);
  }
};

