import type {Request, Response} from 'express';
import type {PreviewOrderRequestBody} from '../types/order.js';
import {orderService} from '../services/OrderService.js';

export const orderController = {
  previewOrder(req: Request<{}, unknown, PreviewOrderRequestBody>, res: Response) {
    const orderPreview = orderService.previewOrder(req.body);

    res.status(200).json({
      body: orderPreview,
    });
  },
};
