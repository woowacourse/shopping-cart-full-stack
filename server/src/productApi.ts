import { Router } from 'express';

import {
  getAllProducts,
  createProduct,
  deleteProduct,
} from './service/productService.ts';

import { products } from './database/inMemoryDatabase.ts';

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

    if (!request.name || !request.price) {
      return res.status(400).send({ message: '유효하지 않은 형식입니다.' });
    }

    if (request.name.length > 100) {
      return res.status(400).send({ message: '상품명이 100자를 초과합니다.' });
    }

    if (request.price <= 0) {
      return res.status(400).send({ message: '가격은 1원 이상입니다.' });
    }

    if (isNaN(request.price)) {
      return res.status(400).send({ message: '가격은 숫자입니다.' });
    }

    const isDuplicateName = getAllProducts().some((product) => {
      return product.getProduct().name === request.name;
    });

    if (isDuplicateName) {
      return res.status(400).send({ message: '중복된 상품명입니다.' });
    }

    res.status(201).send(createProduct(request));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const productId = req.params.id;

    if (!products.has(productId)) {
      return res.status(404).send({ message: '유효하지 않은 경로입니다.' });
    }
    deleteProduct(productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
