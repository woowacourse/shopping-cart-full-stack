import { createApp } from '../app.js';
import { createCartController } from '../controllers/cartController.js';
import { createCouponController } from '../controllers/couponController.js';
import { createOrderSheetController } from '../controllers/orderSheetController.js';
import { createProductController } from '../controllers/productController.js';
import FixedAmountCoupon from '../models/coupons/FixedAmountCoupon.js';
import RateCoupon from '../models/coupons/RateCoupon.js';
import InMemoryStorage from '../storages/InMemoryStorage.js';
import request from 'supertest';

describe('쿠폰 API 테스트', () => {
  const storage = new InMemoryStorage();
  const productController = createProductController(storage);
  const cartController = createCartController(storage);
  const orderSheetController = createOrderSheetController(storage);
  const couponController = createCouponController(storage);
  const app = createApp({
    productController,
    cartController,
    orderSheetController,
    couponController,
  });

  afterEach(() => {
    storage.clearAllItems('coupons');
  });

  test('최대 선택 가능 쿠폰 수와 모든 쿠폰 정보를 반환한다.', async () => {
    const fixedAmountCoupon = new FixedAmountCoupon({
      code: 'FIXED5000',
      name: '5,000원 할인 쿠폰',
      amount: 5000,
      expiresAt: new Date('2026-12-31'),
      conditions: {
        minimumOrderAmount: 100000,
      },
    });
    const rateCoupon = new RateCoupon({
      code: 'MIRACLESALE',
      name: '30% 할인 쿠폰',
      rate: 30,
      expiresAt: new Date('2026-12-31'),
    });
    storage.addItemById(
      'coupons',
      fixedAmountCoupon.getId(),
      fixedAmountCoupon,
    );
    storage.addItemById('coupons', rateCoupon.getId(), rateCoupon);

    const res = await request(app).get('/api/coupons/');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      maxCouponCount: 2,
      coupons: [
        {
          id: fixedAmountCoupon.getId(),
          code: 'FIXED5000',
          name: '5,000원 할인 쿠폰',
          expiresAt: '2026-12-31T00:00:00.000Z',
          conditions: {
            minimumOrderAmount: 100000,
          },
        },
        {
          id: rateCoupon.getId(),
          code: 'MIRACLESALE',
          name: '30% 할인 쿠폰',
          expiresAt: '2026-12-31T00:00:00.000Z',
        },
      ],
    });
  });
});
