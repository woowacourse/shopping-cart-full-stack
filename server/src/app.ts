import express from 'express';

import { getAllProducts } from './service/productService.ts';

const app = express();
app.use(express.json());

app.get('/products', (_req, res) => {
  res.status(200).send(getAllProducts());
});

export default app;
