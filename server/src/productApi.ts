import { Router } from 'express';

import {
  getAllProducts,
  createProduct,
  deleteProduct,
  hasProduct,
  isDuplicateProductName,
} from './service/productService.ts';

const router = Router();

router.get('/', (req, res, next) => {
  try {
    res.status(200).send(getAllProducts());
  } catch (error) {
    next(error);
  }
});

router.post('/', (req, res, next) => {
  try {
    const request = req.body;

    if (isDuplicateProductName(request.name)) {
      return res.status(400).send({ message: '중복된 상품명입니다.' });
    }

    res.status(201).send(createProduct(request));
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).send({ message: error.message });
    }

    next(error);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const productId = req.params.id;

    if (!hasProduct(productId)) {
      return res.status(404).send({ message: '유효하지 않은 경로입니다.' });
    }
    deleteProduct(productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
