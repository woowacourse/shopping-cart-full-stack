import type { Request, Response } from "express";

import { success } from "../../common/response.ts";
import * as orderSheetsService from "./orderSheets.service.ts";

export const getOrderSheetById = (req: Request, res: Response) => {
  const orderSheetId = Number(req.params.orderSheetId);
  const orderSheet = orderSheetsService.getOrderSheetById(orderSheetId);

  return success(res, orderSheet);
};

export const createOrderSheet = (req: Request, res: Response) => {
  const cartId = Number(req.params.cartId);
  const productIds = req.body.productIds;
  const orderSheet = orderSheetsService.createOrderSheet(cartId, productIds);

  return success(res, { id: orderSheet.id });
};

export const getOrderSheetPricing = (req: Request, res: Response) => {
  const orderSheetId = Number(req.params.orderSheetId);

  const pricing = orderSheetsService.getOrderSheetPricing(orderSheetId);

  return success(res, { pricing });
};

export const patchOrderSheetShippingArea = (req: Request, res: Response) => {
  const orderSheetId = Number(req.params.orderSheetId);
  const isRemoteShippingArea = req.body.isRemoteShippingArea;

  const orderSheet = orderSheetsService.patchOrderSheetShippingArea(
    orderSheetId,
    isRemoteShippingArea,
  );

  return success(res, undefined);
};

export const getOrderSheetAbleCoupons = (req: Request, res: Response) => {
  const orderSheetId = Number(req.params.orderSheetId);

  const able = orderSheetsService.getOrderSheetAbleCoupons(orderSheetId);

  return success(res, { able });
};

export const postOrderSheetCouponDiscountPreview = (
  req: Request,
  res: Response,
) => {
  const orderSheetId = Number(req.params.orderSheetId);
  const selectedCoupons = req.body.selectedCoupons;

  const couponDiscountAmount =
    orderSheetsService.postOrderSheetCouponDiscountPreview(
      orderSheetId,
      selectedCoupons,
    );

  return success(res, { couponDiscountAmount });
};

export const patchOrderSheetCoupons = (req: Request, res: Response) => {
  const orderSheetId = Number(req.params.orderSheetId);
  const selectedCoupons = req.body.selectedCoupons;

  orderSheetsService.patchOrderSheetCoupons(orderSheetId, selectedCoupons);

  return success(res, undefined);
};
