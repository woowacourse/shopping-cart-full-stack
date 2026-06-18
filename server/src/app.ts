import express from 'express';
import cors from 'cors';

import {asyncHandler} from './middlewares/asyncHandler.js';
import {errorHandler} from './middlewares/errorHandler.js';
import {cartController} from './controllers/CartController.js';
import {productController} from './controllers/ProductController.js';
import {preorderController} from './controllers/PreorderController.js';
import {couponController} from './controllers/CouponController.js';

const app = express();

const localAllowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
const allowedOrigins = createAllowedOrigins();

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/products', asyncHandler(productController.getProducts));
app.post('/products', asyncHandler(productController.createProduct));
app.delete('/products/:productId', asyncHandler(productController.deleteProduct));

app.get('/carts', asyncHandler(cartController.getCartItems));
app.patch('/carts/:cartItemId', asyncHandler(cartController.updateQuantity));
app.delete('/carts/:cartItemId', asyncHandler(cartController.deleteCartItem));

app.post('/preorder', asyncHandler(preorderController.createPreorder));
app.get('/preorder/:preorderId', asyncHandler(preorderController.getPreorder));

app.get('/coupons', asyncHandler(couponController.getCoupons));

app.use(errorHandler);

export default app;

function createAllowedOrigins() {
  if (!process.env.CLIENT_ORIGIN) return localAllowedOrigins;

  return [...localAllowedOrigins, process.env.CLIENT_ORIGIN];
}
