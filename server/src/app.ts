import express, { type ErrorRequestHandler } from 'express';

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

app.get('/products', (req, res, next) => {
  try {
    res.status(200).send(getAllProducts());
  } catch (error) {
    next(error);
  }
});

app.post('/products', (req, res, next) => {
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

app.delete('/products/:id', (req, res, next) => {
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

app.get('/carts', (_req, res, next) => {
  try {
    res.status(200).send(getShoppingCart());
  } catch (error) {
    next(error);
  }
});

app.patch('/carts/:id', (req, res, next) => {
  try {
    const productId = req.params.id;
    const request = req.body.quantity;
    if (!shoppingCart.hasProductId(productId)) {
      return res.status(404).send({ message: '유효하지 않은 경로입니다.' });
    }

    if (req.body.quantity < 1) {
      return res
        .status(400)
        .send({ message: '상품 수량이 1 이상이어야 합니다.' });
    }

    if (req.body.quantity > 99) {
      return res
        .status(400)
        .send({ message: '상품 수량이 99 이하여야 합니다.' });
    }

    patchShoppingCart(productId, request);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.delete('/carts/:id', (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!shoppingCart.hasProductId(productId)) {
      return res.status(404).send({ message: '유효하지 않은 경로입니다.' });
    }
    deleteProduct(productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

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

app.post('/carts', (_req, res) => {
  res.status(501).send({
    message: 'Not Implemented',
  });
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
