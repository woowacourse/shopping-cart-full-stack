import { Router } from 'express';
import { getProducts, postProducts, deleteProducts } from '../controllers/ProductsController.js';

const productRouter = Router();

productRouter.get('/products', getProducts);
productRouter.post('/products', postProducts);
productRouter.delete('/products/:productId', deleteProducts);

export default productRouter;
