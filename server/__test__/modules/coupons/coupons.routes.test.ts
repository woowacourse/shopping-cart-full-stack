import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../../../src/middlewares/errorHandlers.js';
import { Product } from '../../../src/modules/products/product.model.js';
import {
  resetTestDatabase,
  seedOrder,
  seedProduct,
} from '../../helpers/testDatabase.js';
import { couponRouter } from '../../../src/modules/coupons/coupons.routes.js';

const mockProduct = new Product({
  productId: 'product-1',
  productName: '콜라',
  productPrice: 12000,
  remainingQuantity: 25,
  imageUrl: 'src/assets/coke.png',
});

const app = express();

app.use(express.json());
app.use(couponRouter);
app.use(errorHandler);

describe('쿠폰 API', () => {
  beforeEach(() => {
    resetTestDatabase();
    seedProduct(mockProduct.productId, mockProduct);

    jest.useFakeTimers({
      doNotFake: ['setImmediate'],
    });

    jest.setSystemTime(new Date('2026-06-14T06:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('주문 기준 쿠폰 목록을 조회한다', async () => {
    seedOrder(mockProduct, 10);

    const response = await request(app).get('/orders/order-1/coupons');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      couponList: [
        {
          couponId: 'FIXED5000',
          couponName: '5,000원 할인 쿠폰',
          couponDescription: '최소 주문 금액: 100,000원',
          isDisabled: false,
          couponExpiration: new Date('2026-11-30T23:59:59').toISOString(),
        },
        {
          couponId: 'BOGO',
          couponName: '2개 구매 시 1개 무료 쿠폰',
          couponDescription: '',
          isDisabled: false,
          couponExpiration: new Date('2026-06-30T23:59:59').toISOString(),
        },
        {
          couponId: 'FREESHIPPING',
          couponName: '5만원 이상 구매 시 무료 배송 쿠폰',
          couponDescription: '최소 주문 금액: 50,000원',
          isDisabled: false,
          couponExpiration: new Date('2026-08-31T23:59:59').toISOString(),
        },
        {
          couponId: 'MIRACLESALE',
          couponName: '미라클모닝 30% 할인 쿠폰',
          couponDescription: '사용 가능 시간: 오전 4시부터 7시까지',
          isDisabled: false,
          couponExpiration: new Date('2026-07-31T23:59:59').toISOString(),
        },
      ],
    });
  });

  it('현재 주문에서 사용할 수 없는 쿠폰은 isDisabled true로 응답한다', async () => {
    jest.setSystemTime(new Date('2026-06-14T10:00:00'));

    seedOrder(mockProduct, 2);

    const response = await request(app).get('/orders/order-1/coupons');

    expect(response.status).toBe(200);
    expect(
      response.body.couponList.map(
        ({
          couponId,
          isDisabled,
        }: {
          couponId: string;
          isDisabled: boolean;
        }) => ({
          couponId,
          isDisabled,
        }),
      ),
    ).toEqual([
      { couponId: 'FIXED5000', isDisabled: true },
      { couponId: 'BOGO', isDisabled: true },
      { couponId: 'FREESHIPPING', isDisabled: true },
      { couponId: 'MIRACLESALE', isDisabled: true },
    ]);
  });

  it('존재하지 않는 주문의 쿠폰 목록을 조회하면 에러를 응답한다', async () => {
    const response = await request(app).get('/orders/unknown-order/coupons');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: 'ORDER_NOT_FOUND',
      message: '존재하지 않는 주문입니다.',
    });
  });
});
