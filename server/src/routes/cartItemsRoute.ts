import { Router } from 'express';
import CartItemsContorller from '../controllers/CartItemsContorller';

export const createCartItemsRouter = (cartItemsController: CartItemsContorller) => {
  const cartItemsRouter = Router();

  cartItemsRouter.get('/', cartItemsController.getCartItems);
  cartItemsRouter.post('/', cartItemsController.postCartItems);
  cartItemsRouter.patch('/:cartItemId', cartItemsController.patchCartItems);
  cartItemsRouter.delete('/:cartItemId', cartItemsController.deleteCartItems);

  return cartItemsRouter;
};
