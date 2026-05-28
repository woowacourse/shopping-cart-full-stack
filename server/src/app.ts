import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';

import productRouter from './productApi.ts';
import shoppingCartRouter from './shoppingCartApi.ts';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/products', productRouter);
app.use('/carts', shoppingCartRouter);

app.get('/slow', async (req, res, next) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3001));

    if (!res.headersSent) {
      return res.status(408).send({ message: '요청 시간이 초과되었습니다.' });
    }
  } catch (error) {
    next(error);
  }
});

app.use((_req, res) => {
  res.status(404).send({ message: '유효하지 않은 경로입니다.' });
});

app.use((req, res, next) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      return res.status(408).send({
        message: '요청 시간이 초과되었습니다.',
      });
    }
  }, 3000);

  res.on('finish', () => {
    clearTimeout(timeout);
  });

  next();
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  res.status(500).send({ message: '서버 내부 오류입니다.' });
};

app.use(errorHandler);

export default app;
