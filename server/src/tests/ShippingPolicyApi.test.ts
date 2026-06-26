import { createApp } from '../app.js';
import InMemoryStorage from '../storages/InMemoryStorage.js';
import request from 'supertest';
import { createCartController } from '../controllers/cartController.js';
import { createProductController } from '../controllers/productController.js';
import { createOrderSheetController } from '../controllers/orderSheetController.js';
import { createCouponController } from '../controllers/couponController.js';

describe('배송 정책 API 테스트', () => {
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

  test('배송비 정책을 반환한다.', async () => {
    const res = await request(app).get('/api/shipping-policy/');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      baseFee: 3000,
      freeShippingThreshold: 100000,
    });
  });
});
