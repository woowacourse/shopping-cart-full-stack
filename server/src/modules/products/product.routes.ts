import { Router } from 'express';
import { productService } from './product.service.js';

export const productRouter = Router();

productRouter.get('/products', (_req, res, next) => {
  try {
    const product = productService.getProducts();
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});
productRouter.post('/products', (req, res, next) => {
  try {
    const product = productService.addProduct(req.body ?? {});
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

productRouter.delete('/products/:productId', (req, res, next) => {
  try {
    productService.deleteProduct(req.params.productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
