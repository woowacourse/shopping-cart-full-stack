import { DB } from "./db/in-memory-db.js";
import { createApp } from "./app.js";
import ProductController from "./features/product/product.controller.js";
import CartController from "./features/cart/cart.controller.js";
import InMemoryProductRepository from "./features/product/product.repository.js";
import ProductService from "./features/product/product.service.js";
import DeleteProductUseCase from "./features/product/delete-product.usecase.js";
import InMemoryCartRepository from "./features/cart/cart.repository.js";
import CartService from "./features/cart/cart.service.js";

const PORT = process.env.PORT ?? 3000;

if (!DB) {
  console.error("DB 연결 실패");
}
const productRepository = new InMemoryProductRepository(DB);
const productService = new ProductService(productRepository);

const cartRepository = new InMemoryCartRepository(DB);
const cartService = new CartService(cartRepository);

const deleteProductUseCase = new DeleteProductUseCase(productService, cartService);
const productController = new ProductController(productService, deleteProductUseCase);
const cartController = new CartController(cartService);

const app = createApp({ productController, cartController });
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
