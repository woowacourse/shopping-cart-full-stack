import request from 'supertest';
import app from '../../src/app';
import { describe, expect, test } from '@jest/globals';

import {
  createProduct,
  getAllProducts,
} from '../../src/service/productService';

const data = {
  name: 'test',
  price: 1000,
  image: 'example/com',
};

createProduct(data);

describe('상품 GET API 테스트', () => {
  test('클라이언트가 GET 요청 시 상품 목록을 반환한다.', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: getAllProducts()[0].getProduct().id,
        ...data,
      },
    ]);
  });
});
