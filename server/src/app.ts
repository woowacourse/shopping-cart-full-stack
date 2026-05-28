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
  app.use(express.json());
  app.get("/api/products/", productController.get);
  app.post(
    "/api/products/",
    productBodyValidateMiddelware,
    productController.add,
  );
  app.delete("/api/products/:id/", productController.delete);
  app.get("/api/cart/", cartController.get);
  app.patch(
    "/api/cart/items/:id/",
    cartBodyValidateMiddelware,
    cartController.update,
  );
  app.delete("/api/cart/items/:id/", cartController.delete);
  app.use(
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
