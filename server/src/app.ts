import express from 'express';
import ProductManager from './model/ProductManager.js';
import Cart from './model/Cart.js';
import AppService from './service/AppService.js';
import { errorHandler } from './errors/errorHandler.js';
import ProductService from './domain/product/product.service.js';
import { InMemoryProductRepository } from './domain/product/product.repository.js';

// export const cart = new Cart();
const inMemoryProductRepository = new InMemoryProductRepository();
const productService = new ProductService(inMemoryProductRepository);

const appService = new AppService(productService);

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 상품 추가
app.post('/products', (req, res) => {
  try {
    const { name, price, imgUrl, quantity } = req.body;

    const id = appService.addProduct({ name, price, imgUrl, quantity });

    res.status(201).json({
      code: 201,
      message: '성공적으로 생성되었습니다.',
      result: { id },
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// // 상품 삭제
// app.delete('/products/:id', (req, res) => {
//   try {
//     const productId = req.params.id;

//     appService.deleteProductWithCascade(Number(productId));

//     res.status(204).json();
//   } catch (error) {
//     const { status, code, message } = errorHandler(error);
//     res.status(status).json({ code, message });
//   }
// });

// // 상품 조회
// app.get('/products', (_, res) => {
//   try {
//     const products = productManager.getProducts();

//     res.status(200).json({
//       code: 200,
//       message: '요청에 성공했습니다.',
//       result: { products },
//     });
//   } catch (error) {
//     const { status, code, message } = errorHandler(error);
//     res.status(status).json({ code, message });
//   }
// });

// // 장바구니 상품 조회
// app.get('/carts', (_, res) => {
//   try {
//     const cartItems = appService.getCartItems();

//     res.status(200).json({
//       code: 200,
//       message: '요청에 성공했습니다.',
//       result: { cartItems },
//     });
//   } catch (error) {
//     const { status, code, message } = errorHandler(error);
//     res.status(status).json({ code, message });
//   }
// });

// // 장바구니 상품 삭제
// app.delete('/carts/:id', (req, res) => {
//   try {
//     const productId = req.params.id;

//     cart.deleteCartItem(Number(productId));

//     res.status(204).json();
//   } catch (error) {
//     const { status, code, message } = errorHandler(error);
//     res.status(status).json({ code, message });
//   }
// });

// // 장바구니 상품 수량 변경
// app.patch('/carts/:id', (req, res) => {
//   try {
//     const productId = Number(req.params.id);
//     const { orderCount } = req.body;

//     appService.updateCartOrderCount(productId, orderCount);

//     res.status(200).json({
//       code: 200,
//       message: '성공적으로 수량이 변경되었습니다.',
//       result: {
//         id: productId,
//         orderCount: orderCount,
//       },
//     });
//   } catch (error) {
//     const { status, code, message } = errorHandler(error);
//     res.status(status).json({ code, message });
//   }
// });

export default app;
