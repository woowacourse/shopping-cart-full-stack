import request from 'supertest';
import app from '../app.js';
import { products, orders } from '../db/inMemoryDb.js';

const addProduct = async (price: number, quantity = 99) => {
  const response = await request(app)
    .post('/products')
    .send({ name: '상품', price, imgUrl: 'https://x.com', quantity });

  return response.body.result.id as number;
};

describe('POST /orders API 테스트', () => {
  beforeEach(() => {
    products.length = 0;
    orders.length = 0;
  });

  test('선택한 상품으로 주문을 생성하면 201과 주문 id를 응답한다.', async () => {
    // given
    const productId = await addProduct(5000);

    // when
    const response = await request(app)
      .post('/orders')
      .send({ selectedProducts: [{ id: productId, orderCount: 2 }] });

    // then
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: '성공적으로 생성되었습니다.',
      result: { id: expect.any(Number) },
    });
  });

  test('선택한 상품이 없으면 400과 EMPTY_SELECTED_PRODUCTS 코드를 응답한다.', async () => {
    // when
    const response = await request(app)
      .post('/orders')
      .send({ selectedProducts: [] });

    // then
    expect(response.status).toBe(400);
    expect(response.body.code).toBe('EMPTY_SELECTED_PRODUCTS');
  });

  test('존재하지 않는 상품으로 주문하면 404와 PRODUCT_NOT_EXIST 코드를 응답한다.', async () => {
    // when
    const response = await request(app)
      .post('/orders')
      .send({ selectedProducts: [{ id: 9999, orderCount: 1 }] });

    // then
    expect(response.status).toBe(404);
    expect(response.body.code).toBe('PRODUCT_NOT_EXIST');
  });
});

describe('GET /orders/:id API 테스트', () => {
  beforeEach(() => {
    products.length = 0;
    orders.length = 0;
  });

  const createOrder = async (
    selectedProducts: { id: number; orderCount: number }[],
  ) => {
    const response = await request(app)
      .post('/orders')
      .send({ selectedProducts });

    return response.body.result.id as number;
  };

  test('주문 정보와 결제 금액(배송비 3,000원)을 응답한다.', async () => {
    // given: 5,000원 × 2 = 10,000원 (10만원 미만 → 배송비 3,000원)
    const productId = await addProduct(5000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when
    const response = await request(app).get(`/orders/${orderId}`);

    // then
    expect(response.status).toBe(200);
    expect(response.body.result).toEqual({
      id: orderId,
      isRemoteArea: false,
      products: [
        {
          id: productId,
          name: '상품',
          price: 5000,
          imgUrl: 'https://x.com',
          orderCount: 2,
        },
      ],
      payment: {
        orderPrice: 10000,
        shippingFee: 3000,
        discountAmount: 0,
        totalPrice: 13000,
      },
    });
  });

  test('주문 금액이 100,000원 이상이면 배송비가 무료다.', async () => {
    // given: 50,000원 × 2 = 100,000원
    const productId = await addProduct(50000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when
    const response = await request(app).get(`/orders/${orderId}`);

    // then
    expect(response.body.result.payment).toEqual({
      orderPrice: 100000,
      shippingFee: 0,
      discountAmount: 0,
      totalPrice: 100000,
    });
  });

  test('존재하지 않는 주문 조회 시 404와 ORDER_NOT_EXIST 코드를 응답한다.', async () => {
    // when
    const response = await request(app).get('/orders/9999');

    // then
    expect(response.status).toBe(404);
    expect(response.body.code).toBe('ORDER_NOT_EXIST');
  });
});

describe('PATCH /orders/:id API 테스트', () => {
  beforeEach(() => {
    products.length = 0;
    orders.length = 0;
  });

  const createOrder = async (
    selectedProducts: { id: number; orderCount: number }[],
  ) => {
    const response = await request(app)
      .post('/orders')
      .send({ selectedProducts });

    return response.body.result.id as number;
  };

  test('도서 산간 지역으로 변경하면 200과 변경된 정보를 응답한다.', async () => {
    // given
    const productId = await addProduct(5000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when
    const response = await request(app)
      .patch(`/orders/${orderId}`)
      .send({ isRemoteArea: true });

    // then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: '성공적으로 변경되었습니다.',
      result: { id: orderId, isRemoteArea: true },
    });
  });

  test('도서 산간 지역으로 변경 후 조회하면 배송비가 재계산된다.', async () => {
    // given: 5,000원 × 2 = 10,000원 (기본 배송비 3,000원 + 도서 산간 3,000원)
    const productId = await addProduct(5000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);
    await request(app).patch(`/orders/${orderId}`).send({ isRemoteArea: true });

    // when
    const response = await request(app).get(`/orders/${orderId}`);

    // then
    expect(response.body.result.isRemoteArea).toBe(true);
    expect(response.body.result.payment).toEqual({
      orderPrice: 10000,
      shippingFee: 6000,
      discountAmount: 0,
      totalPrice: 16000,
    });
  });

  test('존재하지 않는 주문 변경 시 404와 ORDER_NOT_EXIST 코드를 응답한다.', async () => {
    // when
    const response = await request(app)
      .patch('/orders/9999')
      .send({ isRemoteArea: true });

    // then
    expect(response.status).toBe(404);
    expect(response.body.code).toBe('ORDER_NOT_EXIST');
  });
});

describe('GET /orders/:id/coupons API 테스트', () => {
  beforeEach(() => {
    products.length = 0;
    orders.length = 0;
  });

  const createOrder = async (
    selectedProducts: { id: number; orderCount: number }[],
  ) => {
    const response = await request(app)
      .post('/orders')
      .send({ selectedProducts });

    return response.body.result.id as number;
  };

  test('주문에 적용 가능한 쿠폰 목록을 필요한 필드와 함께 응답한다.', async () => {
    // given
    const productId = await addProduct(60000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when
    const response = await request(app).get(`/orders/${orderId}/coupons`);

    // then
    expect(response.status).toBe(200);
    expect(response.body.result.coupons).toHaveLength(4);
    response.body.result.coupons.forEach((coupon: Record<string, unknown>) => {
      expect(coupon).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          isSelected: expect.any(Boolean),
          isDisabled: expect.any(Boolean),
          dueDate: expect.any(String),
          minOrderAmount: expect.any(Number),
          availableTime: expect.objectContaining({
            startTime: expect.any(String),
            endTime: expect.any(String),
          }),
        }),
      );
    });
  });

  test('최소 주문 금액 미달 쿠폰(FIXED5000)은 isDisabled가 true다.', async () => {
    // given: 주문 금액 6,000원 (FIXED5000 최소 주문 100,000원 미달)
    const productId = await addProduct(3000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when
    const response = await request(app).get(`/orders/${orderId}/coupons`);

    // then
    const fixed5000 = response.body.result.coupons.find(
      (coupon: { name: string }) => coupon.name === '5,000원 할인 쿠폰',
    );
    expect(fixed5000.isDisabled).toBe(true);
  });

  test('존재하지 않는 주문의 쿠폰 조회 시 404와 ORDER_NOT_EXIST 코드를 응답한다.', async () => {
    // when
    const response = await request(app).get('/orders/9999/coupons');

    // then
    expect(response.status).toBe(404);
    expect(response.body.code).toBe('ORDER_NOT_EXIST');
  });
});

describe('POST /orders/:id/coupons/discount API 테스트', () => {
  beforeEach(() => {
    products.length = 0;
    orders.length = 0;
  });

  const createOrder = async (
    selectedProducts: { id: number; orderCount: number }[],
  ) => {
    const response = await request(app)
      .post('/orders')
      .send({ selectedProducts });

    return response.body.result.id as number;
  };

  test('FIXED5000 쿠폰 선택 시 5,000원 할인 금액을 응답한다.', async () => {
    // given
    const productId = await addProduct(60000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when (쿠폰 id 1 = FIXED5000)
    const response = await request(app)
      .post(`/orders/${orderId}/coupons/discount`)
      .send({ coupons: [1] });

    // then
    expect(response.status).toBe(200);
    expect(response.body.result).toEqual({ discountAmount: 5000 });
  });

  test('BOGO 쿠폰 선택 시 수량 3개 이상 상품 중 단가 최고가만큼 할인한다.', async () => {
    // given: 60,000원 상품 3개
    const productId = await addProduct(60000);
    const orderId = await createOrder([{ id: productId, orderCount: 3 }]);

    // when (쿠폰 id 2 = BOGO)
    const response = await request(app)
      .post(`/orders/${orderId}/coupons/discount`)
      .send({ coupons: [2] });

    // then
    expect(response.body.result).toEqual({ discountAmount: 60000 });
  });

  test('존재하지 않는 쿠폰 선택 시 404와 COUPON_NOT_EXIST 코드를 응답한다.', async () => {
    // given
    const productId = await addProduct(60000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when
    const response = await request(app)
      .post(`/orders/${orderId}/coupons/discount`)
      .send({ coupons: [9999] });

    // then
    expect(response.status).toBe(404);
    expect(response.body.code).toBe('COUPON_NOT_EXIST');
  });
});

describe('PATCH /orders/:id/coupons API 테스트', () => {
  beforeEach(() => {
    products.length = 0;
    orders.length = 0;
  });

  const createOrder = async (
    selectedProducts: { id: number; orderCount: number }[],
  ) => {
    const response = await request(app)
      .post('/orders')
      .send({ selectedProducts });

    return response.body.result.id as number;
  };

  test('선택한 쿠폰을 주문에 적용하면 200과 적용된 쿠폰 목록을 응답한다.', async () => {
    // given
    const productId = await addProduct(60000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when (쿠폰 id 1 = FIXED5000)
    const response = await request(app)
      .patch(`/orders/${orderId}/coupons`)
      .send({ coupons: [1] });

    // then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: '성공적으로 변경되었습니다.',
      result: { id: orderId, coupons: [1] },
    });
  });

  test('쿠폰 적용 후 주문 조회 시 결제 금액에 할인이 반영된다.', async () => {
    // given: 60,000원 x 2 = 120,000원 (무료 배송), FIXED5000 적용 시 5,000원 할인
    const productId = await addProduct(60000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);
    await request(app).patch(`/orders/${orderId}/coupons`).send({ coupons: [1] });

    // when
    const response = await request(app).get(`/orders/${orderId}`);

    // then
    expect(response.body.result.payment).toEqual({
      orderPrice: 120000,
      shippingFee: 0,
      discountAmount: 5000,
      totalPrice: 115000,
    });
  });

  test('쿠폰 적용 후 쿠폰 목록 조회 시 적용한 쿠폰이 isSelected로 표시된다.', async () => {
    // given
    const productId = await addProduct(60000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);
    await request(app).patch(`/orders/${orderId}/coupons`).send({ coupons: [1] });

    // when
    const response = await request(app).get(`/orders/${orderId}/coupons`);

    // then
    const coupons = response.body.result.coupons as {
      id: number;
      isSelected: boolean;
    }[];
    expect(coupons.find((coupon) => coupon.id === 1)?.isSelected).toBe(true);
    expect(coupons.find((coupon) => coupon.id === 2)?.isSelected).toBe(false);
  });

  test('존재하지 않는 쿠폰 적용 시 404와 COUPON_NOT_EXIST 코드를 응답한다.', async () => {
    // given
    const productId = await addProduct(60000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when
    const response = await request(app)
      .patch(`/orders/${orderId}/coupons`)
      .send({ coupons: [9999] });

    // then
    expect(response.status).toBe(404);
    expect(response.body.code).toBe('COUPON_NOT_EXIST');
  });

  test('존재하지 않는 주문에 쿠폰 적용 시 404와 ORDER_NOT_EXIST 코드를 응답한다.', async () => {
    // when
    const response = await request(app)
      .patch('/orders/9999/coupons')
      .send({ coupons: [1] });

    // then
    expect(response.status).toBe(404);
    expect(response.body.code).toBe('ORDER_NOT_EXIST');
  });
});

describe('쿠폰 적용 검증 (개수 제한 / 비활성 차단)', () => {
  beforeEach(() => {
    products.length = 0;
    orders.length = 0;
  });

  const createOrder = async (
    selectedProducts: { id: number; orderCount: number }[],
  ) => {
    const response = await request(app)
      .post('/orders')
      .send({ selectedProducts });

    return response.body.result.id as number;
  };

  test('쿠폰을 3개 선택해 적용하면 400과 COUPON_SELECTION_EXCEEDED 코드를 응답한다.', async () => {
    // given: 주문 금액 120,000원 (세 쿠폰 모두 적용 가능하지만 개수 초과)
    const productId = await addProduct(60000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when
    const response = await request(app)
      .patch(`/orders/${orderId}/coupons`)
      .send({ coupons: [1, 2, 3] });

    // then
    expect(response.status).toBe(400);
    expect(response.body.code).toBe('COUPON_SELECTION_EXCEEDED');
  });

  test('비활성(조건 미달) 쿠폰을 적용하면 400과 COUPON_NOT_APPLICABLE 코드를 응답한다.', async () => {
    // given: 주문 금액 60,000원 (FIXED5000 최소 주문 100,000원 미달 → 비활성)
    const productId = await addProduct(30000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when
    const response = await request(app)
      .patch(`/orders/${orderId}/coupons`)
      .send({ coupons: [1] });

    // then
    expect(response.status).toBe(400);
    expect(response.body.code).toBe('COUPON_NOT_APPLICABLE');
  });

  test('할인 미리보기에서도 비활성 쿠폰이면 400과 COUPON_NOT_APPLICABLE 코드를 응답한다.', async () => {
    // given: 주문 금액 60,000원
    const productId = await addProduct(30000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when
    const response = await request(app)
      .post(`/orders/${orderId}/coupons/discount`)
      .send({ coupons: [1] });

    // then
    expect(response.status).toBe(400);
    expect(response.body.code).toBe('COUPON_NOT_APPLICABLE');
  });

  test('할인 미리보기에서도 3개 선택하면 400과 COUPON_SELECTION_EXCEEDED 코드를 응답한다.', async () => {
    // given
    const productId = await addProduct(60000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when
    const response = await request(app)
      .post(`/orders/${orderId}/coupons/discount`)
      .send({ coupons: [1, 2, 3] });

    // then
    expect(response.status).toBe(400);
    expect(response.body.code).toBe('COUPON_SELECTION_EXCEEDED');
  });
});
