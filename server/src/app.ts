import express from "express";
import ProductService from "./domain/product/product.service.js";
import { InMemoryProductRepository } from "./domain/product/product.repository.js";
import { InMemoryCartRepository } from "./domain/cart/cart.repository.js";
import CartService from "./domain/cart/cart.service.js";
import ProductController from "./controllers/product.controller.js";
import CartController from "./controllers/cart.controller.js";

const inMemoryProductRepository = new InMemoryProductRepository();
const inMemoryCartRepository = new InMemoryCartRepository();

const productService = new ProductService(
  inMemoryProductRepository,
  inMemoryCartRepository,
);
const cartService = new CartService(
  inMemoryCartRepository,
  inMemoryProductRepository,
);
const productController = new ProductController(productService);
const cartController = new CartController(cartService);

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// 상품 추가
app.post("/products", productController.addProduct);

// 상품 삭제
app.delete("/products/:id", productController.deleteProduct);

// 상품 조회
app.get("/products", productController.getProducts);

// 장바구니에 상품 추가
app.post("/carts", cartController.addCartItem);

// 장바구니 상품 조회
app.get("/carts", cartController.getCartItems);

// 장바구니 상품 삭제
app.delete("/carts/:id", cartController.deleteCartItem);

// 장바구니 상품 수량 변경
app.patch("/carts/:id", cartController.updateItemCount);

export default app;

export const resetApp = () => {
  productService.reset();
  cartService.reset();
};
