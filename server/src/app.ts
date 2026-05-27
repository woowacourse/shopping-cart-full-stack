import express from 'express';

import {cartController} from './controllers/CartController.js';
import {asyncHandler} from './middlewares/asyncHandler.js';
import {errorHandler} from './middlewares/errorHandler.js';
import {productController} from './controllers/ProductController.js';

const app = express();
app.use(express.json());

app.get('/products', asyncHandler(productController.getProducts));
app.post('/products', asyncHandler(productController.createProduct));
app.delete('/products/:id', asyncHandler(productController.deleteProduct));

app.get('/carts', asyncHandler(cartController.getCartItems));
app.patch('/carts/:id', asyncHandler(cartController.updateQuantity));
app.delete('/carts/:id', asyncHandler(cartController.deleteCartItem));

app.use(errorHandler);

export default app;
