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
    const data = {
      name: 'test',
      price: 1000,
      image: 'example/com',
    };

    const response = await request(app).post('/products').send(data);

    expect(response.status).toBe(201);
    expect(response.body).toEqual([
      {
        id: getAllProducts()[0].getProduct().id,
        ...data,
      },
    ]);
  });

  test('클라이언트가 GET 요청 시 상품 목록을 반환한다.', async () => {
    const data = {
      name: 'test',
      price: 1000,
      image: 'example/com',
    };

    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: getAllProducts()[0].getProduct().id,
        ...data,
      },
    ]);
  });

  test('클라이언트가 DELETE 요청 시 상품을 삭제한다.', async () => {
    const product = getAllProducts();

    createShoppingCart(product[0].getProduct().id, 3);

    const response = await request(app).delete(
      `/products/${getAllProducts()[0].getProduct().id}`,
    );

    expect(response.status).toBe(204);
    expect(getAllProducts()).toEqual([]);
    expect(getShoppingCart()).toEqual([]);
  });
});
