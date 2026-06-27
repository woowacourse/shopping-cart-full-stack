import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import productRouter from './routes/productsRoutes';
import cartItemsRouter from './routes/cartItemsRoute';
import orderCheckRouter from './routes/orderCheckRoute';
import errorHandler from './middlewares/errorHandler';
import openApiSpec from './docs/openapi';

const app = express();

app.use(cors());

app.use(express.json());

app.get('/openapi.json', (_req, res) => {
  res.json(openApiSpec);
});

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    explorer: true,
    customSiteTitle: 'Shopping Cart Full Stack API Docs',
  }),
);

app.use('', productRouter);
app.use('', cartItemsRouter);
app.use('', orderCheckRouter);

app.use(errorHandler);

export default app;
