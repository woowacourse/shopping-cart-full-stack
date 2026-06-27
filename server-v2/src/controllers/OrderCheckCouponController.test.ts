import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../app.js';

describe('OrderCheck coupon endpoints', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-18T05:00:00+09:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('쿠폰 계산과 적용 결과를 API로 확인할 수 있다.', async () => {
    await request(app).post('/order-check').expect(201);

    const couponListResponse = await request(app).get('/order-check/coupons').expect(200);
    expect(couponListResponse.body.data.selectedCoupons).toEqual(['MIRACLESALE']);

    const calculateResponse = await request(app)
      .post('/order-check/coupons')
      .send({ selectedCouponId: ['MIRACLESALE'] })
      .expect(200);
    expect(calculateResponse.body.data.discountAmount).toBe(3000);

    await request(app)
      .patch('/order-check/coupons')
      .send({ selectedCouponId: ['MIRACLESALE'] })
      .expect(204);

    const payInfoResponse = await request(app).get('/order-check/pay-info').expect(200);
    expect(payInfoResponse.body.data.couponDiscountAmount).toBe(3000);
    expect(payInfoResponse.body.data.totalOrderAmount).toBe(10000);
  });

  it('무료배송 쿠폰이 적용되면 도서산간 여부와 상관없이 배송비는 0원이다.', async () => {
    await request(app)
      .patch('/carts/products/1')
      .send({ quantity: 10 })
      .expect(200);

    await request(app).post('/order-check').expect(201);

    await request(app)
      .patch('/order-check/select/remote-areas')
      .send({ checkStatus: true })
      .expect(200);

    await request(app)
      .patch('/order-check/coupons')
      .send({ selectedCouponId: ['FREESHIPPING'] })
      .expect(204);

    const payInfoResponse = await request(app).get('/order-check/pay-info').expect(200);
    expect(payInfoResponse.body.data.deliveryFee).toBe(0);
    expect(payInfoResponse.body.data.couponDiscountAmount).toBe(0);
    expect(payInfoResponse.body.data.totalOrderAmount).toBe(50000);
  });
});
