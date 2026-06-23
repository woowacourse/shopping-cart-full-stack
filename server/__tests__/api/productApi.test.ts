import request from 'supertest';
import app from '../../src/app';
import { describe, expect, test } from '@jest/globals';

import { getAllProducts } from '../../src/service/productService';
import {
  createShoppingCart,
  getShoppingCart,
} from '../../src/service/shoppingCartService';

describe('상품 API 테스트', () => {
  test('클라이언트가 POST 요청 시 상품을 등록한다.', async () => {
    const beforeProducts = getAllProducts();
    const data = {
      name: 'test',
      price: 1000,
      image: 'example/com',
    };

    const response = await request(app).post('/products').send(data);
    const products = getAllProducts();
    const createdProduct = products[products.length - 1].getProduct();

    expect(response.status).toBe(201);
    expect(response.body).toEqual(products.map((product) => product.getProduct()));
    expect(response.body).toHaveLength(beforeProducts.length + 1);
    expect(createdProduct).toEqual({ id: createdProduct.id, ...data });
  });

  test('클라이언트가 GET 요청 시 상품 목록을 반환한다.', async () => {
    const response = await request(app).get('/products');
    const products = getAllProducts();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(products.map((product) => product.getProduct()));
  });

  test('클라이언트가 DELETE 요청 시 상품을 삭제한다.', async () => {
    const product = getAllProducts();
    const deletedProductId = product[0].getProduct().id;

    createShoppingCart(deletedProductId, 3);

    const response = await request(app).delete(`/products/${deletedProductId}`);

    expect(response.status).toBe(204);
    expect(getAllProducts().map((product) => product.getProduct().id)).not.toContain(
      deletedProductId,
    );
    expect(
      getShoppingCart().map(({ product }) => product?.getProduct().id),
    ).not.toContain(deletedProductId);
  });
});
