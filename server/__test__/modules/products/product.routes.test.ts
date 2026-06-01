import express from 'express';
import request from 'supertest';
import { cartItemsDB, productsDB } from '../../../src/db.js';
import { CartItem } from '../../../src/modules/cart/cartItem.model.js';
import { cartItemRepository } from '../../../src/modules/cart/cartItem.repository.js';
import { productRouter } from '../../../src/modules/products/product.routes.js';

const mockProduct = {
  productId: '1',
  productName: 'testName',
  productPrice: 1300,
  remainingQuantity: 25,
  imageUrl: 'src/assets/test.png',
};

const app = express();

app.use(express.json());
app.use(productRouter);

describe('상품 API', () => {
  beforeEach(() => {
    productsDB.clear();
    cartItemsDB.clear();
  });

  it('상품 목록 요청', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  it('상품 추가', async () => {
    const response = await request(app).post('/products').send({
      productName: mockProduct.productName,
      productPrice: mockProduct.productPrice,
      remainingQuantity: mockProduct.remainingQuantity,
      imageUrl: mockProduct.imageUrl,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ productId: expect.any(String) });
  });
  it('상품 삭제', async () => {
    const response = await request(app).post('/products').send({
      productName: mockProduct.productName,
      productPrice: mockProduct.productPrice,
      remainingQuantity: mockProduct.remainingQuantity,
      imageUrl: mockProduct.imageUrl,
    });

    const deleteRes = await request(app).delete(
      `/products/${response.body.productId}`,
    );
    expect(deleteRes.status).toBe(204);
  });

  it('상품을 삭제하면 장바구니에 담긴 동일한 상품도 함께 삭제된다', async () => {
    const productRes = await request(app).post('/products').send({
      productName: mockProduct.productName,
      productPrice: mockProduct.productPrice,
      remainingQuantity: mockProduct.remainingQuantity,
      imageUrl: mockProduct.imageUrl,
    });
    const { productId } = productRes.body;

    cartItemRepository.save(
      new CartItem({
        cartItemId: 'cart-item-1',
        productId,
        purchaseQuantity: 2,
      }),
    );

    const deleteRes = await request(app).delete(`/products/${productId}`);

    expect(deleteRes.status).toBe(204);
    expect(cartItemRepository.findByProductId(productId)).toBeUndefined();
  });
});
