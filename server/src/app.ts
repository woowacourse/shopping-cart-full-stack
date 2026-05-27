import express from 'express';

import {cartController} from './controllers/CartController.js';
import {productController} from './controllers/ProductController.js';

const app = express();
app.use(express.json());

app.get('/products', productController.getProducts);
app.post('/products', productController.createProduct);
app.delete('/products/:id', productController.deleteProduct);

app.get('/carts', cartController.getCartItems);
app.patch('/carts/:id', cartController.updateQuantity);
app.delete('/carts/:id', cartController.deleteCartItem);

export default app;
