import express from 'express';
import cors from 'cors';
import {
  cartAppService,
  orderAppService,
  productAppService,
} from './container.js';
import CartController from './domain/cart/cart.controller.js';
import OrderController from './domain/order/order.controller.js';
import ProductController from './domain/product/product.controller.js';
import { errorMiddleware } from './errors/errorMiddleware.js';
import { createCartRouter } from './domain/cart/cart.routes.js';
import { createOrderRouter } from './domain/order/order.routes.js';
import { createProductRouter } from './domain/product/product.routes.js';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
  }),
);
app.use(express.json());

app.use('/products', createProductRouter(new ProductController(productAppService)));
app.use('/carts', createCartRouter(new CartController(cartAppService)));
app.use('/orders', createOrderRouter(new OrderController(orderAppService)));

app.use(errorMiddleware);

export default app;
