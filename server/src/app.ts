import express from 'express';
import cors from 'cors';

import {cartController} from './controllers/CartController.js';
import {asyncHandler} from './middlewares/asyncHandler.js';
import {errorHandler} from './middlewares/errorHandler.js';
import {productController} from './controllers/ProductController.js';

const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

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

app.use(errorHandler);

export default app;
