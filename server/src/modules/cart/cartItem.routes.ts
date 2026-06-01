import { Router } from 'express';
import { AppError } from '../../errors/AppError.js';
import type { CartItemService } from './cartItem.service.js';

// 입력 형식(타입) 검증은 전달 계층의 관심사로 둔다.
// 값의 범위(1~99) 같은 도메인 규칙은 Model이 책임진다.
const validatePurchaseQuantityType = (purchaseQuantity: unknown) => {
  if (typeof purchaseQuantity !== 'number') {
    throw new AppError(
      400,
      'INVALID_PURCHASE_QUANTITY',
      '유효하지 않은 구매 수량입니다.',
    );
  }
};

export const createCartItemRouter = (cartItemService: CartItemService) => {
  const router = Router();

  router.get('/cart/items', (_req, res, next) => {
    try {
      const cartItems = cartItemService.getCartItems();
      res.status(200).json(cartItems);
    } catch (error) {
      next(error);
    }
  });

  router.post('/cart/items', (req, res, next) => {
    try {
      validatePurchaseQuantityType(req.body?.purchaseQuantity);

      const cartItem = cartItemService.addCartItem(
        req.body?.productId,
        req.body.purchaseQuantity,
      );

      const responseBody = { cartItemId: cartItem.cartItemId };

      if (cartItem.isNew) return res.status(201).json(responseBody);

      return res.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/cart/items/:cartItemId', (req, res, next) => {
    try {
      cartItemService.deleteCartItem(req.params.cartItemId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  router.patch('/cart/items/:cartItemId', (req, res, next) => {
    try {
      validatePurchaseQuantityType(req.body.purchaseQuantity);

      cartItemService.changePurchaseQuantity(
        req.params.cartItemId,
        req.body.purchaseQuantity,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
};
