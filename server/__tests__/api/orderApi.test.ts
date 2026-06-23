import request from 'supertest';
import app from '../../src/app';
import { describe, expect, test } from '@jest/globals';

import { getAllProducts } from '../../src/service/productService';

function getSeedProduct() {
  return getAllProducts()[0].getProduct();
}

async function createTestOrder(quantity = 3) {
  const product = getSeedProduct();
  const response = await request(app)
    .post('/orders')
    .send({ items: [{ productId: product.id, quantity }] });

  return response.body.id as string;
}

describe('주문 API 테스트', () => {
  test('클라이언트가 POST 요청 시 주문을 생성한다.', async () => {
    const product = getSeedProduct();

    const response = await request(app)
      .post('/orders')
      .send({ items: [{ productId: product.id, quantity: 3 }] });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: expect.any(String) });
  });

  test('클라이언트가 GET 요청 시 주문 정보를 조회한다.', async () => {
    const id = await createTestOrder();

    const response = await request(app).get(`/orders/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      products: expect.any(Array),
      isRemoteArea: false,
      amount: {
        orderAmount: expect.any(Number),
        discountAmount: expect.any(Number),
        shippingFee: expect.any(Number),
        totalAmount: expect.any(Number),
      },
    });
  });

  test('클라이언트가 PATCH 요청 시 도서 산간 여부를 수정한다.', async () => {
    const id = await createTestOrder();

    const response = await request(app)
      .patch(`/orders/${id}`)
      .send({ isRemoteArea: true });

    expect(response.status).toBe(204);

    const orderResponse = await request(app).get(`/orders/${id}`);
    expect(orderResponse.body.isRemoteArea).toBe(true);
  });

  test('클라이언트가 GET 요청 시 주문 쿠폰 목록을 조회한다.', async () => {
    const id = await createTestOrder();

    const response = await request(app).get(`/orders/${id}/coupons`);

    expect(response.status).toBe(200);
    expect(response.body).toContainEqual(
      expect.objectContaining({
        id: 'FIXED5000',
        isSelected: expect.any(Boolean),
        isDisabled: expect.any(Boolean),
        name: expect.any(String),
        dueDate: expect.any(String),
        minOrderAmount: expect.any(Number),
      }),
    );
  });

  test('클라이언트가 POST 요청 시 선택 쿠폰 할인 금액을 계산한다.', async () => {
    const id = await createTestOrder();

    const response = await request(app)
      .post(`/orders/${id}/coupons/discount`)
      .send({ coupons: ['FIXED5000'] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ discountAmount: 5000 });
  });

  test('클라이언트가 PATCH 요청 시 주문 쿠폰을 수정한다.', async () => {
    const id = await createTestOrder();

    const response = await request(app)
      .patch(`/orders/${id}/coupons`)
      .send({ coupons: ['FIXED5000'] });

    expect(response.status).toBe(204);

    const couponsResponse = await request(app).get(`/orders/${id}/coupons`);
    expect(
      couponsResponse.body.find(({ id: couponId }: { id: string }) => {
        return couponId === 'FIXED5000';
      }).isSelected,
    ).toBe(true);
  });

  test('쿠폰을 3개 이상 전달하면 400을 반환한다.', async () => {
    const id = await createTestOrder();

    const response = await request(app)
      .post(`/orders/${id}/coupons/discount`)
      .send({ coupons: ['FIXED5000', 'BOGO', 'MIRACLESALE'] });

    expect(response.status).toBe(400);
  });

  test('존재하지 않는 쿠폰을 전달하면 404를 반환한다.', async () => {
    const id = await createTestOrder();

    const response = await request(app)
      .post(`/orders/${id}/coupons/discount`)
      .send({ coupons: ['UNKNOWN'] });

    expect(response.status).toBe(404);
  });
});
