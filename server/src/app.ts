import express from 'express';

import {
  getAllProducts,
  createProduct,
  deleteProduct,
} from './service/productService.ts';

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

export default app;
