import express from 'express';
import productRouter from './routes/productsRoute';
import cartItemsRouter from './routes/cartItemsRoute';
import errorHandler from './middlewares/errorHandler';

const app = express();
app.use(express.json());

app.use('', productRouter);
app.use('', cartItemsRouter);

app.use(errorHandler);

export default app;
