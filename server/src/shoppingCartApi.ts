import { Router } from 'express';
import {
  getShoppingCart,
  patchShoppingCart,
  deleteShoppingCart,
  hasShoppingCartProduct,
} from './service/shoppingCartService.ts';

const router = Router();

router.get('/', (_req, res, next) => {
  try {
    res.status(200).send(getShoppingCart());
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', (req, res, next) => {
  try {
    const productId = req.params.id;
    const quantity = req.body.quantity;

    if (!hasShoppingCartProduct(productId)) {
      return res.status(404).send({ message: '유효하지 않은 경로입니다.' });
    }

    patchShoppingCart(productId, quantity);
    res.status(204).send();
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
    if (!hasShoppingCartProduct(productId)) {
      return res.status(404).send({ message: '유효하지 않은 경로입니다.' });
    }
    deleteShoppingCart(productId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post('/', (_req, res) => {
  res.status(501).send({
    message: 'Not Implemented',
  });
});

export default router;
