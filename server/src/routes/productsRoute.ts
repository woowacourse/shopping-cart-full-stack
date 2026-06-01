import { Router } from 'express';
import ProductsController from '../controllers/ProductsController';

const productRouter = Router();

const productsController = new ProductsController();

productRouter.get('/products', productsController.getProducts);
productRouter.post('/products', productsController.postProducts);
productRouter.delete('/products/:productId', productsController.deleteProducts);

export default productRouter;
