import express, { Request, Response } from 'express';
import productRouter from './routes/product';
import cartRouter from './routes/cart';

const app = express();

app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/product', productRouter);
app.use('/cart', cartRouter);

export default app;
