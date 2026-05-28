import express from "express";
import {
  productBodyValidateMiddelware,
  cartBodyValidateMiddelware,
} from "./middlewares/BodyValiadateMiddleware.js";
import { ProductController, CartController } from "./controllers.js";
import { NotFoundError, InternalServerError } from "./errors.js";

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

  router
    .route("/api/products/")
    .get(productController.get)
    .post(productBodyValidateMiddelware, productController.add);

  router.route("/api/products/:id/").delete(productController.delete);

  router.route("/api/cart/").get(cartController.get);

  router
    .route("/api/cart/items/:id/")
    .patch(cartBodyValidateMiddelware, cartController.update)
    .delete(cartController.delete);

  router.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (err instanceof NotFoundError) {
        res.status(err.statusCode).send({
          code: err.code,
          message: err.message,
        });
      } else {
        const err = new InternalServerError();
        res.status(err.statusCode).send({
          code: err.code,
          message: err.message,
        });
      }
    },
  );

  return app;
}
