import { Router } from 'express';
import ProductsController from '../controllers/ProductsController';
const productRouter = Router();

const productsController = new ProductsController();

productRouter.get('/products', productsController.getProducts);

export default productRouter;
