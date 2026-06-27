import { Router } from 'express';
import {
  postCartItem,
  getCart,
  getCartPayInfo,
  patchCartItemSelection,
  patchAllCartItemsSelection,
  patchCartItemQuantity,
  deleteCartItem,
} from '../controllers/CartItemsController.js';

const cartItemsRouter = Router();

cartItemsRouter.post('/cart', postCartItem);
cartItemsRouter.get('/cart', getCart);
cartItemsRouter.get('/cart/pay-info', getCartPayInfo);
cartItemsRouter.patch('/carts/select/product/:productId', patchCartItemSelection);
cartItemsRouter.patch('/carts/select', patchAllCartItemsSelection);
cartItemsRouter.patch('/carts/products/:productId', patchCartItemQuantity);
cartItemsRouter.delete('/cart/product/:productId', deleteCartItem);

export default cartItemsRouter;
