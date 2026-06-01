import express from 'express';
import cors from 'cors';
import ProductsController from './controllers/ProductsController';
import CartItemsContorller from './controllers/CartItemsContorller';
import InMemoryProductsRepository from './repositories/InMemoryProductsRepository';
import InMemoryCartItemsRepository from './repositories/InMemoryCartItemsRepository';
import ProductsService from './services/ProductsService';
import CartItemsService from './services/CartItemsService';
import { createProductsRouter } from './routes/productsRoute';
import { createCartItemsRouter } from './routes/cartItemsRoute';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

const inMemoryProductsRepository = new InMemoryProductsRepository();
const inMemoryCartItemsRepository = new InMemoryCartItemsRepository();
const productsService = new ProductsService({
  productsRepository: inMemoryProductsRepository,
  cartItemsRepository: inMemoryCartItemsRepository,
});
const cartItemsService = new CartItemsService({
  productsRepository: inMemoryProductsRepository,
  cartItemsRepository: inMemoryCartItemsRepository,
});
const productsController = new ProductsController({ service: productsService });
const cartItemsController = new CartItemsContorller({ service: cartItemsService });

app.use('/products', createProductsRouter(productsController));
app.use('/cart', createCartItemsRouter(cartItemsController));

app.use(errorHandler);

export default app;
