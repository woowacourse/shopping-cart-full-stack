import type { RequestHandler } from "express";
import { validateCreateOrder, validatePatchOrderCoupon, validatePatchOrderShipping } from "./orders.schema";
import { createOrder, getCoupons as getCouponsService, getOrder as getOrderService, patchOrderCoupon as patchOrderCouponService, patchOrderShipping as patchOrderShippingService } from "./orders.service";

export const postOrder: RequestHandler = async (req, res) => {
  const body = validateCreateOrder(req.body);

  const result = await createOrder(body.products);

  res.status(201).json({
    status: "success",
    message: "주문이 정상적으로 생성되었습니다.",
    data: result,
  });
};

export const getOrder: RequestHandler = async (req, res) => {
  const orderId = Number(req.params.orderId);
  const result = await getOrderService(orderId);

  res.status(200).json({
    status: "success",
    data: result,
  });
};

export const getCoupons: RequestHandler = async (req, res) => {
  const orderId = Number(req.params.orderId);
  const result = await getCouponsService(orderId);

  res.status(200).json({
    status: "success",
    data: result,
  });
};

export const patchOrderCoupon: RequestHandler = async (req, res) => {
  const orderId = Number(req.params.orderId);
  const body = validatePatchOrderCoupon(req.body);
  const result = await patchOrderCouponService(orderId, body);

  res.status(200).json({
    status: "success",
    data: result,
  });
};

export const patchOrderShipping: RequestHandler = async (req, res) => {
  const orderId = Number(req.params.orderId);
  const body = validatePatchOrderShipping(req.body);
  const result = await patchOrderShippingService(orderId, body);

  res.status(200).json({
    status: "success",
    data: result,
  });
};
