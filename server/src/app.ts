import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandlers.js';
import { productRouter } from './modules/products/product.routes.js';
import { cartItemRouter } from './modules/cart/cartItem.routes.js';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(productRouter);
app.use(cartItemRouter);
app.use(errorHandler);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
