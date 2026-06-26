import express from 'express';
import cors from 'cors';
import {
  productBodyValidateMiddleware,
  cartBodyValidateMiddelware,
} from './middlewares/BodyValidateMiddleware.js';
import { ProductController } from './controllers/productController.js';
import { CartController } from './controllers/cartController.js';
import { handleErrors } from './errors.js';
import {
  DEFAULT_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
} from './constants/policy.js';
import { OrderSheetController } from './controllers/orderSheetController.js';
import { CouponController } from './controllers/couponController.js';

export function createApp({
  productController,
  cartController,
  orderSheetController,
  couponController,
}: {
  productController: ProductController;
  cartController: CartController;
  orderSheetController: OrderSheetController;
  couponController: CouponController;
}) {
  const app = express();
  const router = app.router;

  router.use(express.json());

  router.use(
    cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://boboyoii.github.io',
      ],
    }),
  );

  router
    .route('/api/products/')
    .get(productController.get)
    .post(productBodyValidateMiddleware, productController.add);

  router.route('/api/products/:id/').delete(productController.delete);

  router.route('/api/cart/').get(cartController.get);

  router
    .route('/api/cart/items/:productId/')
    .patch(cartBodyValidateMiddelware, cartController.update)
    .delete(cartController.delete);

  router.route('/api/shipping-policy/').get((_req, res) => {
    res.send({
      baseFee: DEFAULT_SHIPPING_FEE,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    });
  });

  router.route('/api/coupons/').get(couponController.getAll);

  router.route('/api/order-sheets/').post(orderSheetController.create);
  router
    .route('/api/order-sheets/:id/')
    .get(orderSheetController.getOrderSheet);
  router
    .route('/api/order-sheets/:id/coupons/')
    .get(orderSheetController.getAvailableCoupons)
    .patch(orderSheetController.updateCoupons);
  router
    .route('/api/order-sheets/:id/discount-preview/')
    .post(orderSheetController.previewDiscount);
  router
    .route('/api/order-sheets/:id/pricing/')
    .get(orderSheetController.getPricing);
  router
    .route('/api/order-sheets/:id/shipping-area/')
    .patch(orderSheetController.updateShippingArea);

  router.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      handleErrors(res, err);
    },
  );

  return app;
}
