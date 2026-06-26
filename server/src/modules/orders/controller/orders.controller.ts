import { RequestHandler } from "express";
import {
  validateCreateOrder,
  validateUpdateOrder,
  validateCouponIds,
} from "../schema/orders.schema";
import { OrdersService } from "../service/orders.service";

export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  getOrder: RequestHandler = (_, res) => {
    const order = this.ordersService.getOrder();

    res.status(200).json({
      status: "success",
      message: "주문 정보를 정상적으로 조회하였습니다.",
      data: order,
    });
  };

  postOrders: RequestHandler = (req, res) => {
    const orderProducts = validateCreateOrder(req.body);

    const orderId = this.ordersService.createInitialOrder(orderProducts);

    res.status(201).json({
      status: "success",
      message: "주문 정보를 정상적으로 추가하였습니다.",
      data: { orderId },
    });
  };

  updateOrder: RequestHandler = (req, res) => {
    const validated = validateUpdateOrder(req.body);

    let data;
    if ("couponIds" in validated) {
      data = this.ordersService.updateOrderCoupons(validated.couponIds);
    } else {
      data = this.ordersService.updateOrderIsIsland(validated.isIsland);
    }

    res.status(200).json({
      status: "success",
      message: "주문 정보를 정상적으로 수정하였습니다.",
      data,
    });
  };

  discountPrice: RequestHandler = (req, res) => {
    const couponIds = validateCouponIds(req.body);

    const discountPrice =
      this.ordersService.calculateDiscountPriceByCoupons(couponIds);

    res.status(200).json({
      status: "success",
      message: "할인 금액을 정상적으로 계산하였습니다.",
      data: { discountPrice },
    });
  };
}
