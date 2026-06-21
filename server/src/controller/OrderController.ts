import { Request, Response } from "express";
import {
  deleteOrderService,
  getOrdersService,
  postOrderService,
  postPaymentService,
  updateApplyCouponService,
  updateRemoteAreaService,
} from "../service/OrderService";
import { handleError } from "./ErrorHandler";
import {
  applyCouponsService,
  applySelectedCouponsService,
  getCalculatedDiscountService,
  getCouponCombinationsService,
} from "../service/CouponService";
import { validateCouponCount } from "../util/Validator";
import { productRepository } from "../repositories/ProductRepository";

const getOrder = (request: Request, response: Response): void => {
  try {
    const orderId = Number(request.params.orderId);
    applySelectedCouponsService(orderId);
    const updatedOrder = getOrdersService(orderId);
    const couponCombinations = getCouponCombinationsService(orderId);
    const itemsWithProductData = updatedOrder.items.map(
      ({ productId, quantity }) => ({
        productId,
        quantity,
        productData: productRepository.findById(productId),
      }),
    );
    response.status(200).json({
      ...updatedOrder,
      items: itemsWithProductData,
      couponCombinations,
    });
  } catch (error) {
    handleError(response, error);
  }
};

const postOrder = (request: Request, response: Response): void => {
  try {
    const newOrder = request.body;
    const addedOrder = postOrderService(newOrder);
    applyCouponsService(addedOrder.orderId);
    response.status(201).json(addedOrder);
  } catch (error) {
    handleError(response, error);
  }
};

const patchOrder = (request: Request, response: Response): void => {
  try {
    const orderId = Number(request.params.orderId);
    const remoteArea = Boolean(request.body.remoteArea);
    updateRemoteAreaService(orderId, remoteArea);
    applySelectedCouponsService(orderId);
    response.status(204).send();
  } catch (error) {
    handleError(response, error);
  }
};

const patchCoupon = (request: Request, response: Response): void => {
  try {
    const orderId = Number(request.params.orderId);
    const couponIds = request.body.couponIds;
    validateCouponCount(couponIds);
    updateApplyCouponService(orderId, couponIds);
    applySelectedCouponsService(orderId);
    response.status(204).send();
  } catch (error) {
    handleError(response, error);
  }
};

const deleteOrder = (request: Request, response: Response): void => {
  try {
    const orderId = Number(request.params.orderId);
    deleteOrderService(orderId);
    response.status(204).send();
  } catch (error) {
    handleError(response, error);
  }
};

const postPayment = (request: Request, response: Response): void => {
  try {
    const orderId = Number(request.params.orderId);
    const result = postPaymentService(orderId);
    response.status(200).json(result);
  } catch (error) {
    handleError(response, error);
  }
};

const getCouponCalculate = (request: Request, response: Response): void => {
  try {
    const orderId = Number(request.params.orderId);
    const raw = request.query.couponIds as string;
    const couponIds = raw ? raw.split(",").map(Number) : [];
    const discountAmount = getCalculatedDiscountService(orderId, couponIds);
    response.status(200).json({ discountAmount });
  } catch (error) {
    handleError(response, error);
  }
};

export default {
  getOrder,
  postOrder,
  deleteOrder,
  patchOrder,
  patchCoupon,
  postPayment,
  getCouponCalculate,
};
