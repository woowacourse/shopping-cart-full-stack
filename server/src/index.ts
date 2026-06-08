// index.ts
import app from "./app";
import { productRepository } from "./repositories/ProductRepository";
import { cartRepository } from "./repositories/CartRepository";

const PORT = process.env.PORT ?? 3000;

// 초기 데이터(테스트용)
const product1 = productRepository.addProduct({
  name: "상품이름A",
  price: 35000,
  thumbnailUrl: "/itemImg_1.jpg",
  totalQuantity: 99,
});

const product2 = productRepository.addProduct({
  name: "상품이름B",
  price: 25000,
  thumbnailUrl: "/itemImg_2.jpg",
  totalQuantity: 99,
});

cartRepository.addProductToCart(product1.productId, 2);
cartRepository.addProductToCart(product2.productId, 2);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
