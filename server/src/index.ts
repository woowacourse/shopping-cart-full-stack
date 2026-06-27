import { DB } from "./db/in-memory-db.js";
import { seed } from "./db/seed.js";
import { createApp } from "./app.js";
import ProductController from "./features/product/product.controller.js";
import CartController from "./features/cart/cart.controller.js";
import InMemoryProductRepository from "./features/product/product.repository.js";
import ProductService from "./features/product/product.service.js";
import DeleteProductUseCase from "./features/product/delete-product.usecase.js";
import InMemoryCartRepository from "./features/cart/cart.repository.js";
import CartService from "./features/cart/cart.service.js";
import InMemoryCouponRepository from "./features/coupon/coupon.repository.js";
import CheckoutService from "./features/checkout/checkout.service.js";
import CheckoutController from "./features/checkout/checkout.controller.js";

const PORT = process.env.PORT ?? 3000;

if (!DB) {
  console.error("DB 연결 실패");
}
const productRepository = new InMemoryProductRepository(DB);
const productService = new ProductService(productRepository);

const cartRepository = new InMemoryCartRepository(DB);
const cartService = new CartService(cartRepository);

const couponRepository = new InMemoryCouponRepository(DB);
const checkoutService = new CheckoutService(cartService, couponRepository);
const checkoutController = new CheckoutController(checkoutService);

const deleteProductUseCase = new DeleteProductUseCase(productService, cartService);
const productController = new ProductController(productService, deleteProductUseCase);
const cartController = new CartController(cartService);

seed(DB);

const app = createApp({ productController, cartController, checkoutController });
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
