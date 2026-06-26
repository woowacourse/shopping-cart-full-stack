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
    await request(app)
      .post('/products')
      .send({ ...mockProduct, name: '나이키 양말' });

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
    cartItems.length = 0;
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
      message: '상품이 존재하지 않습니다.',
    });
  });

  test('장바구니에 담긴 상품을 삭제하면, 해당 상품이 장바구니에서도 제거된다.', async () => {
    // given
    const postResponse = await request(app).post('/products').send(mockProduct);
    const { id } = postResponse.body.result;
    await request(app).post(`/carts/${id}`).send({ orderCount: 2 });

    // when
    const response = await request(app).delete(`/products/${id}`);

    // then
    expect(response.status).toBe(204);

    const cartResponse = await request(app).get('/carts');
    expect(cartResponse.body.result.cartItems).not.toContainEqual(
      expect.objectContaining({ id }),
    );
  });

  test('장바구니에 없는 상품을 삭제해도 정상적으로 204를 응답한다.', async () => {
    // given
    const postResponse = await request(app).post('/products').send(mockProduct);
    const { id } = postResponse.body.result;

    // when
    const response = await request(app).delete(`/products/${id}`);

    // then
    expect(response.status).toBe(204);
  });
});

const mockCartItem = {
  id: 1,
  orderCount: 2,
};

describe('GET /carts API 테스트', () => {
  beforeEach(() => {
    products.length = 0;
    cartItems.length = 0;
  });

  test('장바구니가 비어있을 때 빈 배열과 200을 응답한다.', async () => {
    // when
    const response = await request(app).get('/carts');

    // then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: '요청에 성공했습니다.',
      result: { cartItems: [] },
    });
  });

  test('장바구니에 상품 추가 후 조회 시 해당 상품이 목록에 포함된다.', async () => {
    // given
    const productResponse = await request(app).post('/products').send(mockProduct);
    const { id: productId } = productResponse.body.result;
    await request(app).post(`/carts/${productId}`).send({ orderCount: 2 });

    // when
    const response = await request(app).get('/carts');

    // then
    expect(response.status).toBe(200);
    expect(response.body.result.cartItems).toContainEqual(
      expect.objectContaining({
        id: productId,
        name: mockProduct.name,
        price: mockProduct.price,
        imgUrl: mockProduct.imgUrl,
        orderCount: 2,
      }),
    );
  });

  test('장바구니에 상품 2개 추가 후 조회 시 2개가 모두 목록에 포함된다.', async () => {
    // given
    const product1Response = await request(app).post('/products').send(mockProduct);
    const { id: productId1 } = product1Response.body.result;

    const product2Response = await request(app)
      .post('/products')
      .send({ ...mockProduct, name: '나이키 양말' });
    const { id: productId2 } = product2Response.body.result;

    await request(app).post(`/carts/${productId1}`).send({ orderCount: 1 });
    await request(app).post(`/carts/${productId2}`).send({ orderCount: 2 });

    // when
    const response = await request(app).get('/carts');

    // then
    expect(response.status).toBe(200);
    expect(response.body.result.cartItems).toHaveLength(2);
    expect(response.body.result.cartItems).toContainEqual(
      expect.objectContaining({ id: productId1, name: mockProduct.name, orderCount: 1 }),
    );
    expect(response.body.result.cartItems).toContainEqual(
      expect.objectContaining({ id: productId2, name: '나이키 양말', orderCount: 2 }),
    );
  });
});

describe('POST /carts API 테스트', () => {
  beforeEach(() => {
    cartItems.length = 0;
  });

  test('정상적인 요청 시 201과 생성된 id를 응답한다.', async () => {
    // when
    const response = await request(app)
      .post(`/carts/${mockCartItem.id}`)
      .send(mockCartItem);

    // then
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: '성공적으로 생성되었습니다.',
      result: { id: expect.any(Number) },
    });
  });

  test('orderCount 필드가 누락되면 400과 EMPTY_PRODUCT_ORDER_COUNT 코드를 응답한다.', async () => {
    // when
    const response = await request(app).post('/carts/1').send({});

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'EMPTY_PRODUCT_ORDER_COUNT',
      message: '주문 수량 필드가 누락되었습니다.',
    });
  });

  test('orderCount가 0 이하이면 400과 INVALID_PRODUCT_ORDER_COUNT_TYPE 코드를 응답한다.', async () => {
    // when
    const response = await request(app)
      .post('/carts/1')
      .send({ orderCount: 0 });

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
    await request(app).post(`/carts/${mockCartItem.id}`).send(mockCartItem);

    // when
    const response = await request(app).delete(`/carts/${mockCartItem.id}`);

    // then
    expect(response.status).toBe(204);
  });

  test('장바구니 상품 삭제 후 조회 시 해당 상품이 목록에서 제거된다.', async () => {
    // given
    await request(app).post(`/carts/${mockCartItem.id}`).send(mockCartItem);

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
  let productId: number;

  beforeEach(async () => {
    products.length = 0;
    cartItems.length = 0;
    const postResponse = await request(app).post('/products').send(mockProduct);
    productId = postResponse.body.result.id;
    await request(app).post(`/carts/${productId}`).send({ orderCount: 1 });
  });

  test('정상적인 수량 변경 요청 시 200과 변경된 상품 정보를 응답한다.', async () => {
    // given
    const newOrderCount = mockProduct.quantity;

    // when
    const response = await request(app)
      .patch(`/carts/${productId}`)
      .send({ orderCount: newOrderCount });

    // then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: '성공적으로 변경되었습니다.',
      result: { id: productId, orderCount: newOrderCount, isSelected: true },
    });
  });

  test('isSelected만 보내면 수량 검증 없이 선택 상태만 변경된다.', async () => {
    // when
    const response = await request(app)
      .patch(`/carts/${productId}`)
      .send({ isSelected: false });

    // then
    expect(response.status).toBe(200);
    expect(response.body.result).toEqual({
      id: productId,
      orderCount: 1,
      isSelected: false,
    });
  });

  test('상품 재고보다 많은 수량으로 변경 시 400과 PRODUCT_ORDER_COUNT_EXCEEDED 코드를 응답한다.', async () => {
    // when
    const response = await request(app)
      .patch(`/carts/${productId}`)
      .send({ orderCount: mockProduct.quantity + 1 });

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'PRODUCT_ORDER_COUNT_EXCEEDED',
      message: '보유한 상품의 개수를 넘어섰습니다.',
    });
  });

  test('변경할 필드를 보내지 않으면(빈 바디) 기존 상태를 그대로 유지한다.', async () => {
    // when
    const response = await request(app).patch(`/carts/${productId}`).send({});

    // then
    expect(response.status).toBe(200);
    expect(response.body.result).toEqual({
      id: productId,
      orderCount: 1,
      isSelected: true,
    });
  });

  test('존재하지 않는 장바구니 상품 변경 시 404와 PRODUCT_NOT_EXIST 코드를 응답한다.', async () => {
    // when
    const response = await request(app)
      .patch('/carts/9999')
      .send({ isSelected: false });

    // then
    expect(response.status).toBe(404);
    expect(response.body.code).toBe('PRODUCT_NOT_EXIST');
  });

  test('orderCount가 0 이하이면 400과 INVALID_PRODUCT_ORDER_COUNT_TYPE 코드를 응답한다.', async () => {
    // when
    const response = await request(app)
      .patch(`/carts/${productId}`)
      .send({ orderCount: 0 });

    // then
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'INVALID_PRODUCT_ORDER_COUNT_TYPE',
      message: '변경할 수량은 0보다 큰 숫자여야 합니다.',
    });
  });
});

describe('GET /carts/payment API 테스트', () => {
  beforeEach(() => {
    products.length = 0;
    cartItems.length = 0;
  });

  const addProductToCart = async (
    price: number,
    orderCount: number,
    quantity = 99,
  ) => {
    const productResponse = await request(app)
      .post('/products')
      .send({ name: '상품', price, imgUrl: 'https://x.com', quantity });
    const { id } = productResponse.body.result;
    await request(app).post(`/carts/${id}`).send({ orderCount });
    return id;
  };

  test('선택된 상품 기준으로 주문금액, 배송비, 총액을 응답한다. (10만원 미만이면 배송비 3,000원)', async () => {
    // given: 5,000원 × 2 = 10,000원
    await addProductToCart(5000, 2);

    // when
    const response = await request(app).get('/carts/payment');

    // then
    expect(response.status).toBe(200);
    expect(response.body.result).toEqual({
      orderPrice: 10000,
      shippingFee: 3000,
      totalPrice: 13000,
    });
  });

  test('주문 금액이 100,000원 이상이면 배송비가 무료다.', async () => {
    // given: 50,000원 × 2 = 100,000원
    await addProductToCart(50000, 2);

    // when
    const response = await request(app).get('/carts/payment');

    // then
    expect(response.body.result).toEqual({
      orderPrice: 100000,
      shippingFee: 0,
      totalPrice: 100000,
    });
  });

  test('선택 해제된(isSelected: false) 상품은 결제 금액에서 제외된다.', async () => {
    // given
    const id = await addProductToCart(5000, 2);
    await request(app).patch(`/carts/${id}`).send({ isSelected: false });

    // when
    const response = await request(app).get('/carts/payment');

    // then
    expect(response.body.result).toEqual({
      orderPrice: 0,
      shippingFee: 0,
      totalPrice: 0,
    });
  });
});
