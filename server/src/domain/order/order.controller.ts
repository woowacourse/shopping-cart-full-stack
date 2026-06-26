import { Request, Response } from 'express';
import { RESPONSE_MESSAGE } from '../../constants/responseMessage.js';
import OrderAppService from './order.app-service.js';

export default class OrderController {
  constructor(private orderAppService: OrderAppService) {}

  createOrder = (req: Request, res: Response) => {
    const { selectedProducts } = req.body ?? {};

    const id = this.orderAppService.createOrder(selectedProducts);

    res.status(201).json({
      message: RESPONSE_MESSAGE.CREATED,
      result: { id },
    });
  };

  getOrder = (req: Request, res: Response) => {
    const order = this.orderAppService.getOrder(Number(req.params.orderId));

    res.status(200).json({
      message: RESPONSE_MESSAGE.SUCCESS,
      result: order,
    });
  };

  updateOrder = (req: Request, res: Response) => {
    const { isRemoteArea } = req.body ?? {};

    const updated = this.orderAppService.updateOrder({
      id: Number(req.params.orderId),
      isRemoteArea,
    });

    res.status(200).json({
      message: RESPONSE_MESSAGE.UPDATED,
      result: updated,
    });
  };

  getOrderCoupons = (req: Request, res: Response) => {
    const coupons = this.orderAppService.getOrderCoupons(
      Number(req.params.orderId),
    );

    res.status(200).json({
      message: RESPONSE_MESSAGE.SUCCESS,
      result: coupons,
    });
  };

  getCouponsDiscount = (req: Request, res: Response) => {
    const { coupons } = req.body ?? {};

    const discount = this.orderAppService.getCouponsDiscount(
      Number(req.params.orderId),
      coupons,
    );

    res.status(200).json({
      message: RESPONSE_MESSAGE.SUCCESS,
      result: discount,
    });
  };

  updateOrderCoupons = (req: Request, res: Response) => {
    const { coupons } = req.body ?? {};

    const updated = this.orderAppService.updateOrderCoupons(
      Number(req.params.orderId),
      coupons,
    );

    res.status(200).json({
      message: RESPONSE_MESSAGE.UPDATED,
      result: updated,
    });
  };
}
