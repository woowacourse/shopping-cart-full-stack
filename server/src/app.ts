import express from 'express';
import cors from 'cors';
import productRouter from './routes/productsRoute';
import cartItemsRouter from './routes/cartItemsRoute';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(cors());

app.use(express.json());

app.use('', productRouter);
app.use('', cartItemsRouter);

app.use(errorHandler);

export default app;
