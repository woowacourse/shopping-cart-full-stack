import express from 'express';

import {
  getAllProducts,
  createProduct,
  deleteProduct,
} from './service/productService.ts';
import {
  getShoppingCart,
  patchShoppingCart,
} from './service/shoppingCartService.ts';

import { products } from './database/inMemoryDatabase.ts';
import { shoppingCart } from './database/inMemoryDatabase.ts';

const app = express();
app.use(express.json());

app.get('/products', (req, res) => {
  res.status(200).send(getAllProducts());
});

app.post('/products', (req, res) => {
  const request = req.body;

  if (!request.name || !request.price) {
    res.status(400).send({ message: '유효하지 않은 형식입니다.' });
  }

  res.status(201).send(createProduct(request));
});

app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;

  if (!products.has(productId)) {
    res.status(404).send({ message: '유효하지 않은 경로입니다.' });
  }
  deleteProduct(productId);
  res.status(204).send();
});

app.get('/carts', (_req, res) => {
  res.status(200).send(getShoppingCart());
});

app.patch('/carts/:id', (req, res) => {
  const productId = req.params.id;
  const request = req.body.quantity;
  if (!shoppingCart.hasProductId(productId)) {
    res.status(404).send({ message: '유효하지 않은 경로입니다.' });
  }

  patchShoppingCart(productId, request);
  res.status(204).send();
});

app.delete('/carts/:id', (req, res) => {
  const productId = req.params.id;
  if (!shoppingCart.hasProductId(productId)) {
    res.status(404).send({ message: '유효하지 않은 경로입니다.' });
  }
  deleteProduct(productId);
  res.status(204).send();
});

app.get('/slow', async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 3001));

  if (!res.headersSent) {
    res.status(408).send({ message: '요청 시간이 초과되었습니다.' });
  }
});

app.use((_req, res) => {
  res.status(404).send({ message: '유효하지 않은 경로입니다.' });
});

app.use((req, res, next) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).send({
        message: '요청 시간이 초과되었습니다.',
      });
    }
  }, 3000);

  res.on('finish', () => {
    clearTimeout(timeout);
  });

  next();
});

// 500

// 501

export default app;
