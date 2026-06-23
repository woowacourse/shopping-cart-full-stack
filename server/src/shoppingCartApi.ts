import { Router } from 'express';
import {
  getShoppingCart,
  getShoppingCartAmountSummary,
  patchAllShoppingCartSelection,
  patchShoppingCartItem,
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

router.get('/amount-summary', (_req, res, next) => {
  try {
    res.status(200).send(getShoppingCartAmountSummary());
  } catch (error) {
    next(error);
  }
});

router.patch('/', (req, res) => {
  if (typeof req.body.isSelected !== 'boolean') {
    return res.status(400).send({ message: '선택 상태가 올바르지 않습니다.' });
  }

  patchAllShoppingCartSelection(req.body.isSelected);
  res.status(204).send();
});

router.patch('/:id', (req, res, next) => {
  try {
    const productId = req.params.id;
    const quantity = req.body.quantity;

    if (!hasShoppingCartProduct(productId)) {
      return res.status(404).send({ message: '유효하지 않은 경로입니다.' });
    }

    if (
      req.body.isSelected !== undefined &&
      typeof req.body.isSelected !== 'boolean'
    ) {
      return res.status(400).send({ message: '선택 상태가 올바르지 않습니다.' });
    }

    patchShoppingCartItem(productId, {
      quantity,
      isSelected: req.body.isSelected,
    });
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
