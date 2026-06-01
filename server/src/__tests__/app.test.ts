import request from 'supertest';
import app from '../app.js';
import { products, cartItems } from '../db/inMemoryDb.js';

const mockProduct = {
  name: '아디다스 양말',
  price: 13000,
  imgUrl: 'https://image-url.com',
  quantity: 2,
};

describe('GET /products API 테스트', () => {
  beforeEach(() => {
    products.length = 0;
  });

  test('상품이 없을 때 빈 배열을 응답한다.', async () => {
    // when
    const response = await request(app).get('/products');

    // then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 200,
      message: '요청에 성공했습니다.',
      result: { products: [] },
    });
  });

  test('상품 추가 후 조회 시 추가된 상품이 목록에 포함된다.', async () => {
    // given
    const postResponse = await request(app).post('/products').send(mockProduct);
    const { id } = postResponse.body.result;

    // when
    const response = await request(app).get('/products');

    // then
    expect(response.status).toBe(200);
    expect(response.body.result.products).toContainEqual(
      expect.objectContaining({ id, name: mockProduct.name }),
    );
  });

  test('상품 2개 추가 후 조회 시 2개가 목록에 포함된다.', async () => {
    // given
    await request(app).post('/products').send(mockProduct);
    await request(app).post('/products').send({ ...mockProduct, name: '나이키 양말' });

    // when
    const response = await request(app).get('/products');

    // then
    expect(response.status).toBe(200);
    expect(response.body.result.products).toHaveLength(2);
  });
});

describe('POST /products API 테스트', () => {
  beforeEach(() => {
    products.length = 0;
  });

  test('정상적인 상품 정보로 요청 시 201과 생성된 id를 응답한다.', async () => {
    // given
    const newProduct = {
      name: '아디다스 양말',
      price: 13000,
      imgUrl: 'https://image-url.com',
      quantity: 2,
    };

    // when
    const response = await request(app).post('/products').send(newProduct);

    // then
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      code: 201,
      message: '성공적으로 생성되었습니다.',
      result: { id: expect.any(Number) },
    });
  });

  test('상품명이 100자를 초과하면 400과 PRODUCT_NAME_LENGTH_EXCEEDED 코드를 응답한다.', async () => {
    // given
    const invalidProduct = {
      name: 'a'.repeat(101),
      price: 13000,
      imgUrl: 'https://image-url.com',
      quantity: 2,
    };

    // when
    const response = await request(app).post('/products').send(invalidProduct);

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'PRODUCT_NAME_LENGTH_EXCEEDED',
      message: '상품명은 100자를 초과할 수 없습니다.',
    });
  });

  test('가격이 0 이하이면 400과 INVALID_PRODUCT_PRICE_TYPE 코드를 응답한다.', async () => {
    // given
    const invalidProduct = {
      name: '아디다스 양말',
      price: 0,
      imgUrl: 'https://image-url.com',
      quantity: 2,
    };

    // when
    const response = await request(app).post('/products').send(invalidProduct);

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'INVALID_PRODUCT_PRICE_TYPE',
      message: '가격은 0보다 큰 숫자여야 합니다.',
    });
  });

  test('재고 수량이 범위(1~99)를 벗어나면 400과 INVALID_PRODUCT_QUANTITY_RANGE 코드를 응답한다.', async () => {
    // given
    const invalidProduct = {
      name: '아디다스 양말',
      price: 13000,
      imgUrl: 'https://image-url.com',
      quantity: 100,
    };

    // when
    const response = await request(app).post('/products').send(invalidProduct);

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'INVALID_PRODUCT_QUANTITY_RANGE',
      message: '상품 재고는 1이상 99이하의 정수이어야 합니다.',
    });
  });

  test('상품명 필드가 누락되면 400과 EMPTY_PRODUCT_NAME 코드를 응답한다.', async () => {
    // given
    const invalidProduct = {
      price: 13000,
      imgUrl: 'https://image-url.com',
      quantity: 2,
    };

    // when
    const response = await request(app).post('/products').send(invalidProduct);

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'EMPTY_PRODUCT_NAME',
      message: '상품명 필드가 누락되었습니다.',
    });
  });

  test('가격 필드가 누락되면 400과 EMPTY_PRODUCT_PRICE 코드를 응답한다.', async () => {
    // given
    const invalidProduct = {
      name: '아디다스 양말',
      imgUrl: 'https://image-url.com',
      quantity: 2,
    };

    // when
    const response = await request(app).post('/products').send(invalidProduct);

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'EMPTY_PRODUCT_PRICE',
      message: '가격 필드가 누락되었습니다.',
    });
  });

  test('재고 필드가 누락되면 400과 EMPTY_PRODUCT_QUANTITY 코드를 응답한다.', async () => {
    // given
    const invalidProduct = {
      name: '아디다스 양말',
      price: 13000,
      imgUrl: 'https://image-url.com',
    };

    // when
    const response = await request(app).post('/products').send(invalidProduct);

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'EMPTY_PRODUCT_QUANTITY',
      message: '상품 재고 필드가 누락되었습니다.',
    });
  });
});

describe('DELETE /products/:id API 테스트', () => {
  beforeEach(() => {
    products.length = 0;
  });

  test('존재하는 상품 삭제 시 204를 응답한다.', async () => {
    // given
    const postResponse = await request(app).post('/products').send(mockProduct);
    const { id } = postResponse.body.result;

    // when
    const response = await request(app).delete(`/products/${id}`);

    // then
    expect(response.status).toBe(204);
  });

  test('상품 삭제 후 조회 시 해당 상품이 목록에서 제거된다.', async () => {
    // given
    const postResponse = await request(app).post('/products').send(mockProduct);
    const { id } = postResponse.body.result;

    // when
    await request(app).delete(`/products/${id}`);
    const response = await request(app).get('/products');

    // then
    expect(response.body.result.products).not.toContainEqual(
      expect.objectContaining({ id }),
    );
  });

  test('존재하지 않는 상품 삭제 시 404와 PRODUCT_NOT_EXIST 코드를 응답한다.', async () => {
    // given
    const nonExistentId = 9999;

    // when
    const response = await request(app).delete(`/products/${nonExistentId}`);

    // then
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: 'PRODUCT_NOT_EXIST',
      message: '삭제하려는 상품이 존재하지 않습니다.',
    });
  });
});

const mockCartItem = {
  id: 1,
  orderCount: 2,
};

describe('GET /carts API 테스트', () => {
  beforeEach(() => {
    cartItems.length = 0;
  });

  test('장바구니가 비어있을 때 빈 배열과 200을 응답한다.', async () => {
    // when
    const response = await request(app).get('/carts');

    // then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 200,
      message: '요청에 성공했습니다.',
      result: { cartItems: [] },
    });
  });

  test('장바구니에 상품 추가 후 조회 시 해당 상품이 목록에 포함된다.', async () => {
    // given
    await request(app).post('/carts').send(mockCartItem);

    // when
    const response = await request(app).get('/carts');

    // then
    expect(response.status).toBe(200);
    expect(response.body.result.cartItems).toContainEqual(
      expect.objectContaining({ id: mockCartItem.id, orderCount: mockCartItem.orderCount }),
    );
  });
});

describe('POST /carts API 테스트', () => {
  beforeEach(() => {
    cartItems.length = 0;
  });

  test('정상적인 요청 시 201과 생성된 id를 응답한다.', async () => {
    // when
    const response = await request(app).post('/carts').send(mockCartItem);

    // then
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      code: 201,
      message: '성공적으로 생성되었습니다.',
      result: { id: expect.any(Number) },
    });
  });

  test('orderCount 필드가 누락되면 400과 EMPTY_PRODUCT_ORDER_COUNT 코드를 응답한다.', async () => {
    // when
    const response = await request(app).post('/carts').send({ id: 1 });

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'EMPTY_PRODUCT_ORDER_COUNT',
      message: '주문 수량 필드가 누락되었습니다.',
    });
  });

  test('orderCount가 0 이하이면 400과 INVALID_PRODUCT_ORDER_COUNT_TYPE 코드를 응답한다.', async () => {
    // when
    const response = await request(app).post('/carts').send({ id: 1, orderCount: 0 });

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'INVALID_PRODUCT_ORDER_COUNT_TYPE',
      message: '변경할 수량은 0보다 큰 숫자여야 합니다.',
    });
  });
});

describe('DELETE /carts/:id API 테스트', () => {
  beforeEach(() => {
    cartItems.length = 0;
  });

  test('존재하는 장바구니 상품 삭제 시 204를 응답한다.', async () => {
    // given
    await request(app).post('/carts').send(mockCartItem);

    // when
    const response = await request(app).delete(`/carts/${mockCartItem.id}`);

    // then
    expect(response.status).toBe(204);
  });

  test('장바구니 상품 삭제 후 조회 시 해당 상품이 목록에서 제거된다.', async () => {
    // given
    await request(app).post('/carts').send(mockCartItem);

    // when
    await request(app).delete(`/carts/${mockCartItem.id}`);
    const response = await request(app).get('/carts');

    // then
    expect(response.body.result.cartItems).not.toContainEqual(
      expect.objectContaining({ id: mockCartItem.id }),
    );
  });

  test('존재하지 않는 장바구니 상품 삭제 시 404와 PRODUCT_NOT_EXIST_IN_CART 코드를 응답한다.', async () => {
    // given
    const nonExistentId = 9999;

    // when
    const response = await request(app).delete(`/carts/${nonExistentId}`);

    // then
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: 'PRODUCT_NOT_EXIST_IN_CART',
      message: '삭제하려는 상품이 장바구니에 존재하지 않습니다.',
    });
  });
});

describe('PATCH /carts/:id API 테스트', () => {
  beforeEach(() => {
    cartItems.length = 0;
  });

  test('정상적인 수량 변경 요청 시 200과 변경된 수량 정보를 응답한다.', async () => {
    // given
    await request(app).post('/carts').send(mockCartItem);
    const newOrderCount = 5;

    // when
    const response = await request(app)
      .patch(`/carts/${mockCartItem.id}`)
      .send({ orderCount: newOrderCount });

    // then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 200,
      message: '성공적으로 수량이 변경되었습니다.',
      result: { id: mockCartItem.id, orderCount: newOrderCount },
    });
  });

  test('orderCount 필드가 누락되면 400과 EMPTY_PRODUCT_ORDER_COUNT 코드를 응답한다.', async () => {
    // given
    await request(app).post('/carts').send(mockCartItem);

    // when
    const response = await request(app)
      .patch(`/carts/${mockCartItem.id}`)
      .send({});

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'EMPTY_PRODUCT_ORDER_COUNT',
      message: '주문 수량 필드가 누락되었습니다.',
    });
  });

  test('orderCount가 0 이하이면 400과 INVALID_PRODUCT_ORDER_COUNT_TYPE 코드를 응답한다.', async () => {
    // given
    await request(app).post('/carts').send(mockCartItem);

    // when
    const response = await request(app)
      .patch(`/carts/${mockCartItem.id}`)
      .send({ orderCount: 0 });

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'INVALID_PRODUCT_ORDER_COUNT_TYPE',
      message: '변경할 수량은 0보다 큰 숫자여야 합니다.',
    });
  });
});
