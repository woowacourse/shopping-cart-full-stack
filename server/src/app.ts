import express from 'express';
import cors from 'cors';
import {
  productBodyValidateMiddleware,
  cartBodyValidateMiddelware,
} from './middlewares/BodyValidateMiddleware.js';
import { ProductController } from './controllers/productController.js';
import { CartController } from './controllers/cartController.js';
import { handleErrors } from './errors.js';

export function createApp({
  productController,
  cartController,
}: {
  productController: ProductController;
  cartController: CartController;
}) {
  const app = express();
  const router = app.router;

  router.use(express.json());

  router.use(
    cors({
      origin: ['http://localhost:3000', 'http://localhost:5173'],
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
