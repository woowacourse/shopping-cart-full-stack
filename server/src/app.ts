import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandlers.js';
import { productRouter } from './modules/products/product.routes.js';
import { cartItemRouter } from './modules/cart/cartItem.routes.js';
import { couponRouter } from './modules/coupons/coupons.routes.js';
import { orderRouter } from './modules/orders/orders.routes.js';

const app = express();

app.use(
  cors({
    origin: ['https://gamjaismine02.github.io', 'http://localhost:5173'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(productRouter);
app.use(cartItemRouter);
app.use(orderRouter);
app.use(couponRouter);
app.use(errorHandler);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
