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

app.use((_req, res) => {
  res.status(404).send({ message: '유효하지 않은 경로입니다.' });
});

export default app;
