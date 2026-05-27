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

const app = express();
app.use(express.json());

app.get('/products', (_req, res) => {
  res.status(200).send(getAllProducts());
});

app.post('/products', (req, res) => {
  const request = req.body;
  res.status(201).send(createProduct(request));
});

app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  deleteProduct(productId);
  res.status(204).send();
});

app.get('/carts', (_req, res) => {
  res.status(200).send(getShoppingCart());
});

app.patch('/carts/:id', (req, res) => {
  const productId = req.params.id;
  const request = req.body.quantity;
  patchShoppingCart(productId, request);
  res.status(204).send();
});

app.delete('/carts/:id', (req, res) => {
  const productId = req.params.id;
  deleteProduct(productId);
  res.status(204).send();
});

export default app;
