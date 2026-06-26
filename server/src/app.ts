import express, { Request, Response } from 'express';
import productRouter from './routes/product';
import cartRouter from './routes/cart';
import couponRouter from './routes/coupon';
import orderRouter from './routes/order';

const app = express();

const ALLOWED_ORIGINS = ['http://localhost:3000', 'http://localhost:5173', 'https://hjkim0905.github.io'];

app.use((req: Request, res: Response, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/coupons', couponRouter);
app.use('/order', orderRouter);

export default app;
