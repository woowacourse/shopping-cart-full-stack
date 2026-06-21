import type {Request, Response} from 'express';

import {orderService} from '../services/OrderService.js';
import type {CreateOrderRequestBody, PreviewOrderRequestBody} from '../types/order.js';

export const orderController = {
  previewOrder(req: Request<{}, unknown, PreviewOrderRequestBody>, res: Response) {
    const orderPreview = orderService.previewOrder(req.body);

    res.status(200).json({
      body: orderPreview,
    });
  },

  createOrder(req: Request<{}, unknown, CreateOrderRequestBody>, res: Response) {
    const order = orderService.createOrder(req.body);

    res.status(201).json({
      body: order,
    });
  },
};
