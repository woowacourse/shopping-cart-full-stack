import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../../../src/middlewares/errorHandlers.js';
import { orderRouter } from '../../../src/modules/orders/orders.routes.js';
import { Product } from '../../../src/modules/products/product.model.js';
import { resetTestDatabase, seedProduct } from '../../helpers/testDatabase.js';

const mockOrderProduct = {
  productId: 'product-1',
  quantity: 3,
};

const mockProduct = new Product({
  productId: mockOrderProduct.productId,
  productName: '콜라',
  productPrice: 12000,
  remainingQuantity: 25,
  imageUrl: 'src/assets/coke.png',
});

const app = express();

app.use(express.json());
app.use(orderRouter);
app.use(errorHandler);

describe('주문 API', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 5, 18, 12));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    resetTestDatabase();
    seedProduct(mockProduct.productId, mockProduct);
  });

  test('주문 생성', async () => {
    const response = await request(app)
      .post('/orders')
      .send({ products: [mockOrderProduct] });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ orderId: expect.any(String) });
  });

  test('주문 조회 시 상품 정보와 가격 정보를 함께 응답한다', async () => {
    const orderResponse = await request(app)
      .post('/orders')
      .send({ products: [mockOrderProduct] });

    const response = await request(app).get(
      `/orders/${orderResponse.body.orderId}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      orderId: orderResponse.body.orderId,
      products: [
        {
          productId: mockProduct.productId,
          productName: mockProduct.productName,
          productPrice: mockProduct.productPrice,
          imageUrl: mockProduct.imageUrl,
          quantity: mockOrderProduct.quantity,
        },
      ],
      isIsland: false,
      couponIds: ['BOGO'],
      priceInfo: {
        orderPrice: 36000,
        productDiscountPrice: 12000,
        deliveryDiscountPrice: 0,
        deliveryFee: 3000,
        totalPrice: 27000,
      },
    });
  });

  test('주문에 쿠폰 적용', async () => {
    const orderResponse = await request(app)
      .post('/orders')
      .send({
        products: [{ productId: mockProduct.productId, quantity: 10 }],
      });

    const response = await request(app)
      .patch(`/orders/${orderResponse.body.orderId}/coupons`)
      .send({ couponIds: ['FIXED5000'] });

    expect(response.status).toBe(200);
    expect(response.body.couponIds).toEqual(['FIXED5000']);
    expect(response.body.priceInfo).toEqual({
      orderPrice: 120000,
      productDiscountPrice: 5000,
      deliveryDiscountPrice: 0,
      deliveryFee: 0,
      totalPrice: 115000,
    });
  });

  test('주문에 적용하지 않고 선택한 쿠폰의 할인 금액을 미리 계산한다', async () => {
    const orderResponse = await request(app)
      .post('/orders')
      .send({
        products: [{ productId: mockProduct.productId, quantity: 10 }],
      });

    const response = await request(app)
      .post(`/orders/${orderResponse.body.orderId}/discount-price`)
      .send({ couponIds: ['FIXED5000'] });

    const order = await request(app).get(
      `/orders/${orderResponse.body.orderId}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      couponIds: ['FIXED5000'],
      productDiscountPrice: 5000,
      deliveryDiscountPrice: 0,
      totalDiscountPrice: 5000,
    });
    expect(order.body.couponIds).toEqual(['FIXED5000', 'BOGO']);
  });

  test('주문 배송 지역 변경', async () => {
    const orderResponse = await request(app)
      .post('/orders')
      .send({ products: [mockOrderProduct] });

    const response = await request(app)
      .patch(`/orders/${orderResponse.body.orderId}/delivery-area`)
      .send({ isIsland: true });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      orderPrice: 36000,
      productDiscountPrice: 12000,
      deliveryDiscountPrice: 0,
      deliveryFee: 6000,
      totalPrice: 30000,
    });
  });

  test('존재하지 않는 주문 조회 시 에러 응답을 반환한다', async () => {
    const response = await request(app).get('/orders/unknown');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: 'ORDER_NOT_FOUND',
      message: '존재하지 않는 주문입니다.',
    });
  });

  test('주문 상품 목록이 비어 있으면 에러 응답을 반환한다', async () => {
    const response = await request(app)
      .post('/orders')
      .send({ products: [] });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: 'EMPTY_ORDER_PRODUCTS',
      message: '주문 상품 목록이 비어 있습니다.',
    });
  });
});
