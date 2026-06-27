import express from 'express';
import cors from 'cors';

import {cartController} from './controllers/CartController.js';
import {couponController} from './controllers/CouponController.js';
import {orderController} from './controllers/OrderController.js';
import {asyncHandler} from './middlewares/asyncHandler.js';
import {errorHandler} from './middlewares/errorHandler.js';
import {productController} from './controllers/ProductController.js';

const app = express();

const defaultOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
const extraOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = [...defaultOrigins, ...extraOrigins];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/products', asyncHandler(productController.getProducts));
app.post('/products', asyncHandler(productController.createProduct));
app.delete('/products/:id', asyncHandler(productController.deleteProduct));

app.get('/carts', asyncHandler(cartController.getCartItems));
app.patch('/carts/:id', asyncHandler(cartController.updateQuantity));
app.delete('/carts/:id', asyncHandler(cartController.deleteCartItem));

app.get('/coupons', asyncHandler(couponController.getCoupons));

app.post('/order/preview', asyncHandler(orderController.previewOrder));

app.use(errorHandler);

export default app;
