import { DB } from "./db/in-memory-db.js";
import { createApp } from "./app.js";
import ProductController from "./features/product/product.controller.js";
import CartController from "./controllers/cart.controller.js";
import InMemoryProductRepository from "./features/product/product.repository.js";
import ProductService from "./features/product/product.service.js";

const PORT = process.env.PORT ?? 3000;

const productRepository = new InMemoryProductRepository(DB);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const app = createApp({ productController });
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
