import { Router } from 'express';
import CartItemsContorller from '../controllers/CartItemsContorller';
const cartItemsRouter = Router();

const cartItemsController = new CartItemsContorller();

cartItemsRouter.get('/cart', cartItemsController.getCartItems);
cartItemsRouter.post('/cart', cartItemsController.postCartItems);
cartItemsRouter.patch('/cart/:cartItemId', cartItemsController.patchCartItems);
cartItemsRouter.delete('/cart/:cartItemId', cartItemsController.deleteCartItems);

export default cartItemsRouter;
