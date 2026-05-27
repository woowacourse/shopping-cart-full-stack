import request from 'supertest';
import app from '../../src/app';
import { describe, expect, test } from '@jest/globals';

import {
  getAllProducts,
  createProduct,
} from '../../src/service/productService';
import {
  createShoppingCart,
  patchShoppingCart,
  getShoppingCart,
  deleteShoppingCart,
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

describe('장바구니 상품 API 테스트', () => {
  test('클라이언트가 GET 요청 시 장바구니 상품 목록을 받아온다.', async () => {
    const productData = {
      name: 'test',
      price: 1000,
      image: 'example/com',
    };
    const product = createProduct(productData);

    createShoppingCart(product[0].getProduct().id, 3);

    const response = await request(app).get('/carts');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        product: { id: product[0].getProduct().id, ...productData },
        quantity: 3,
      },
    ]);
  });

  test('클라이언트가 PATCH 요청 시 상품 수량을 변경한다', async () => {
    const id = getAllProducts()[0].getProduct().id;

    patchShoppingCart(id, 4);

    const response = await request(app)
      .patch(`/carts/${id}`)
      .send({ quantity: 4 });

    expect(response.status).toBe(204);
    expect(getShoppingCart()[0].quantity).toBe(4);
  });

  test('클라이언트가 DELETE 요청 시 해당 상품을 삭제한다.', async () => {
    const id = getAllProducts()[0].getProduct().id;

    const response = await request(app).delete(`/carts/${id}`);

    expect(response.status).toBe(204);
    expect(getShoppingCart()).toEqual([]);
  });
});

describe('유효하지 않은 경로 테스트', () => {
  test('잘못된 경로로 상품 GET 요청 시 에러 처리한다.', async () => {
    const response = await request(app).get('/products1');
    expect(response.status).toBe(404);
  });

  test('잘못된 경로로 상품 DELETE 요청 시 에러 처리한다.', async () => {
    const response = await request(app).delete('/products/a');
    expect(response.status).toBe(404);
  });

  test('잘못된 경로로 상품 POST 요청 시 에러 처리한다.', async () => {
    const data = {
      name: 'test',
      price: 1000,
      image: 'example/com',
    };

    const response = await request(app).post('/products1').send(data);
    expect(response.status).toBe(404);
  });

  test('잘못된 경로로 장바구니 GET 요청 시 에러 처리한다.', async () => {
    const response = await request(app).get('/carts1');
    expect(response.status).toBe(404);
  });

  test('잘못된 경로로 장바구니 PATCH 요청 시 에러 처리한다.', async () => {
    const response = await request(app).patch('/carts1/1');
    expect(response.status).toBe(404);
  });

  test('잘못된 경로로 장바구니 DELETE 요청 시 에러 처리한다.', async () => {
    const response = await request(app).delete('/carts1/1');
    expect(response.status).toBe(404);
  });
});

describe('유효하지 않은 POST 형식 테스트', () => {
  test('빈 이름으로 POST 요청 시 예외 처리한다.', async () => {
    const data = {
      name: '',
      price: 1000,
    };
    const response = await request(app).post('/products').send(data);

    expect(response.status).toBe(400);
  });

  test('가격이 누락된 POST 요청 시 예외 처리한다.', async () => {
    const data = {
      name: 'test',
    };
    const response = await request(app).post('/products').send(data);

    expect(response.status).toBe(400);
  });

  test('상품명이 100자 초과이면 POST 요청 시 예외 처리한다.', async () => {
    const data = {
      name: 'a'.repeat(104),
      price: 1000,
    };
    const response = await request(app).post('/products').send(data);

    expect(response.status).toBe(400);
  });

  test('가격이 0 이하로 POST 요청 시 예외 처리한다.', async () => {
    const data = {
      name: 'test',
      price: 0,
    };
    const response = await request(app).post('/products').send(data);

    expect(response.status).toBe(400);
  });

  test('가격이 숫자 아닌 상태로 POST 요청 시 예외 처리한다.', async () => {
    const data = {
      name: 'test',
      price: 'test',
    };
    const response = await request(app).post('/products').send(data);

    expect(response.status).toBe(400);
  });

  // 5. 중복된 상품명이면 400을 응답한다.
  test('중복된 상품명이 있는 상품을 POST 요청 시 예외 처리한다.', async () => {
    const productData1 = {
      name: 'test',
      price: 1000,
      image: 'example/com',
    };
    const productData2 = {
      name: 'test',
      price: 1000,
      image: 'example/com',
    };
    const product1 = createProduct(productData1);
    const response = await request(app).post('/products').send(productData2);

    expect(response.status).toBe(400);
  });

  test('상품 수량이 허용 범위를 벗어난 PATCH 요청 시 예외 처리한다.', async () => {
    const productData = {
      name: 'test',
      price: 1000,
      image: 'example/com',
    };
    const product = createProduct(productData);
    const id = product[0].getProduct().id;

    patchShoppingCart(id, 10);

    const response = await request(app)
      .patch(`/carts/${id}`)
      .send({ quantity: -2 });

    expect(response.status).toBe(400);
  });
});

describe('요청 시간 초과 테스트', () => {
  test('요청 처리가 제한 시간보다 오래 걸리면 408을 반환한다', async () => {
    const response = await request(app).get('/slow');

    expect(response.status).toBe(408);
  });
});
