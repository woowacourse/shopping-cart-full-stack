import { createApp } from '../app.js';
import InMemoryStorage from '../storages/InMemoryStorage.js';
import Product from '../models/Product.js';
import request from 'supertest';
import Cart from '../models/Cart.js';
import { createCartController } from '../controllers/cartController.js';
import { createProductController } from '../controllers/productController.js';
import { DEFAULT_USER_ID } from '../constants/user.js';
import { createOrderSheetController } from '../controllers/orderSheetController.js';
import OrderSheet from '../models/OrderSheet.js';
import FixedAmountCoupon from '../models/coupons/FixedAmountCoupon.js';
import RateCoupon from '../models/coupons/RateCoupon.js';
import { createCouponController } from '../controllers/couponController.js';

describe('주문서 API 테스트', () => {
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
  const cart = storage.getItemById('cart', DEFAULT_USER_ID) as Cart;

  const product1 = new Product('수건', 10000, '/some_image2');
  const product2 = new Product('칫솔', 5000, '/some_image');

  beforeEach(() => {
    storage.addItemById('products', product1.getId(), product1);
    storage.addItemById('products', product2.getId(), product2);

    cart.updateItemByProductId(product1.getId(), 3);
  });

  afterEach(() => {
    storage.clearAllItems('products');
    storage.clearAllItems('orderSheets');
    storage.clearAllItems('coupons');
    cart.deleteItemByProductId(product1.getId());
    cart.deleteItemByProductId(product2.getId());
  });

  test('장바구니에 담긴 상품으로 주문서를 생성한다.', async () => {
    const res = await request(app)
      .post('/api/order-sheets/')
      .send({
        items: [{ productId: product1.getId(), quantity: 3 }],
      })
      .set('Accept', 'application/json');

    const orderSheet = storage.getItemById(
      'orderSheets',
      res.body.id,
    ) as OrderSheet;

    expect(res.status).toBe(201);
    expect(orderSheet.toObject()).toEqual(
      expect.objectContaining({
        userId: DEFAULT_USER_ID,
        items: [{ product: product1.toObject(), quantity: 3 }],
        selectedCouponIds: [],
        isRemoteShippingArea: false,
      }),
    );
  });

  test('주문서를 생성할 때 최적 쿠폰 조합을 선택한다.', async () => {
    const fixedAmountCoupon = new FixedAmountCoupon({
      code: 'FIXED5000',
      name: '5,000원 할인 쿠폰',
      amount: 5000,
      expiresAt: new Date('2026-12-31'),
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

    const res = await request(app)
      .post('/api/order-sheets/')
      .send({
        items: [{ productId: product1.getId(), quantity: 3 }],
      })
      .set('Accept', 'application/json');

    const orderSheet = storage.getItemById(
      'orderSheets',
      res.body.id,
    ) as OrderSheet;

    expect(res.status).toBe(201);
    expect(orderSheet.toObject()).toEqual(
      expect.objectContaining({
        selectedCouponIds: [fixedAmountCoupon.getId(), rateCoupon.getId()],
      }),
    );
  });

  test('주문서 ID로 주문서를 조회한다.', async () => {
    const orderSheet = new OrderSheet(DEFAULT_USER_ID, [
      { product: product1.toObject(), quantity: 3 },
    ]);
    storage.addItemById('orderSheets', orderSheet.getId(), orderSheet);

    const res = await request(app).get(
      `/api/order-sheets/${orderSheet.getId()}/`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      orderSheet: {
        id: orderSheet.getId(),
        items: [{ product: product1.toObject(), quantity: 3 }],
        isRemoteShippingArea: false,
        selectedCouponIds: [],
      },
    });
  });

  test('주문서의 도서산간 지역 여부를 수정한다.', async () => {
    const orderSheet = new OrderSheet(DEFAULT_USER_ID, [
      { product: product1.toObject(), quantity: 3 },
    ]);
    storage.addItemById('orderSheets', orderSheet.getId(), orderSheet);

    const res = await request(app)
      .patch(`/api/order-sheets/${orderSheet.getId()}/shipping-area/`)
      .send({ isRemoteShippingArea: true })
      .set('Accept', 'application/json');

    const updatedOrderSheet = storage.getItemById<OrderSheet>(
      'orderSheets',
      orderSheet.getId(),
    ) as OrderSheet;

    expect(res.status).toBe(204);
    expect(updatedOrderSheet.toObject()).toEqual(
      expect.objectContaining({
        isRemoteShippingArea: true,
      }),
    );

    const pricingResponse = await request(app).get(
      `/api/order-sheets/${orderSheet.getId()}/pricing/`,
    );

    expect(pricingResponse.body.pricing.shippingFee).toBe(6000);
  });

  test('주문서의 선택 쿠폰을 수정한다.', async () => {
    const orderSheet = new OrderSheet(DEFAULT_USER_ID, [
      { product: product1.toObject(), quantity: 3 },
    ]);
    storage.addItemById('orderSheets', orderSheet.getId(), orderSheet);

    const res = await request(app)
      .patch(`/api/order-sheets/${orderSheet.getId()}/coupons/`)
      .send({ selectedCouponIds: ['coupon-1', 'coupon-2'] })
      .set('Accept', 'application/json');

    const updatedOrderSheet = storage.getItemById<OrderSheet>(
      'orderSheets',
      orderSheet.getId(),
    ) as OrderSheet;

    expect(res.status).toBe(204);
    expect(updatedOrderSheet.toObject()).toEqual(
      expect.objectContaining({
        selectedCouponIds: ['coupon-1', 'coupon-2'],
      }),
    );
  });

  test('주문서에서 사용할 수 있는 쿠폰 정보를 반환한다.', async () => {
    const orderSheet = new OrderSheet(DEFAULT_USER_ID, [
      { product: product1.toObject(), quantity: 10 },
    ]);
    const fixedAmountCoupon = new FixedAmountCoupon({
      code: 'FIXED5000',
      name: '5,000원 할인 쿠폰',
      amount: 5000,
      expiresAt: new Date('2026-12-31'),
      conditions: {
        minimumOrderAmount: 100000,
      },
    });
    const expiredCoupon = new RateCoupon({
      code: 'MIRACLESALE',
      name: '30% 할인 쿠폰',
      rate: 30,
      expiresAt: new Date('2026-01-01'),
    });
    storage.addItemById('orderSheets', orderSheet.getId(), orderSheet);
    storage.addItemById(
      'coupons',
      fixedAmountCoupon.getId(),
      fixedAmountCoupon,
    );
    storage.addItemById('coupons', expiredCoupon.getId(), expiredCoupon);

    const res = await request(app).get(
      `/api/order-sheets/${orderSheet.getId()}/coupons/`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      coupons: [
        {
          id: fixedAmountCoupon.getId(),
          code: 'FIXED5000',
        },
      ],
    });
  });

  test('선택한 쿠폰 id로 할인 금액을 미리 계산한다.', async () => {
    const orderSheet = new OrderSheet(DEFAULT_USER_ID, [
      { product: product1.toObject(), quantity: 3 },
    ]);
    const fixedAmountCoupon = new FixedAmountCoupon({
      code: 'FIXED5000',
      name: '5,000원 할인 쿠폰',
      amount: 5000,
      expiresAt: new Date('2026-12-31'),
    });
    const rateCoupon = new RateCoupon({
      code: 'MIRACLESALE',
      name: '30% 할인 쿠폰',
      rate: 30,
      expiresAt: new Date('2026-12-31'),
    });
    storage.addItemById('orderSheets', orderSheet.getId(), orderSheet);
    storage.addItemById(
      'coupons',
      fixedAmountCoupon.getId(),
      fixedAmountCoupon,
    );
    storage.addItemById('coupons', rateCoupon.getId(), rateCoupon);

    const res = await request(app)
      .post(`/api/order-sheets/${orderSheet.getId()}/discount-preview/`)
      .send({
        selectedCouponIds: [fixedAmountCoupon.getId(), rateCoupon.getId()],
      })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ discountAmount: 12500 });
    expect(orderSheet.toObject().selectedCouponIds).toEqual([]);
  });

  test('주문서에 저장된 선택 쿠폰을 포함한 결제 금액을 반환한다.', async () => {
    const orderSheet = new OrderSheet(DEFAULT_USER_ID, [
      { product: product1.toObject(), quantity: 3 },
    ]);
    const fixedAmountCoupon = new FixedAmountCoupon({
      code: 'FIXED5000',
      name: '5,000원 할인 쿠폰',
      amount: 5000,
      expiresAt: new Date('2026-12-31'),
    });
    const rateCoupon = new RateCoupon({
      code: 'MIRACLESALE',
      name: '30% 할인 쿠폰',
      rate: 30,
      expiresAt: new Date('2026-12-31'),
    });
    orderSheet.updateCouponIds([fixedAmountCoupon.getId(), rateCoupon.getId()]);
    storage.addItemById('orderSheets', orderSheet.getId(), orderSheet);
    storage.addItemById(
      'coupons',
      fixedAmountCoupon.getId(),
      fixedAmountCoupon,
    );
    storage.addItemById('coupons', rateCoupon.getId(), rateCoupon);

    const res = await request(app).get(
      `/api/order-sheets/${orderSheet.getId()}/pricing/`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      pricing: {
        orderAmount: 30000,
        shippingFee: 3000,
        discountAmount: 12500,
        totalPaymentAmount: 20500,
      },
    });
  });

  test('장바구니에 없는 상품으로 주문서를 생성하려고 하면 404 에러가 발생한다.', async () => {
    const res = await request(app)
      .post('/api/order-sheets/')
      .send({
        items: [{ productId: product2.getId(), quantity: 1 }],
      })
      .set('Accept', 'application/json');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      code: 'RESOURCE_NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다.',
    });
  });

  test('존재하지 않는 상품으로 주문서를 생성하려고 하면 404 에러가 발생한다.', async () => {
    const res = await request(app)
      .post('/api/order-sheets/')
      .send({
        items: [{ productId: 'unknown', quantity: 1 }],
      })
      .set('Accept', 'application/json');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      code: 'RESOURCE_NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다.',
    });
  });

  test('존재하지 않는 주문서를 조회하려고 하면 404 에러가 발생한다.', async () => {
    const res = await request(app).get('/api/order-sheets/unknown/');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      code: 'RESOURCE_NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다.',
    });
  });

  test('존재하지 않는 쿠폰으로 할인 미리보기를 요청하면 404 에러가 발생한다.', async () => {
    const orderSheet = new OrderSheet(DEFAULT_USER_ID, [
      { product: product1.toObject(), quantity: 3 },
    ]);
    storage.addItemById('orderSheets', orderSheet.getId(), orderSheet);

    const res = await request(app)
      .post(`/api/order-sheets/${orderSheet.getId()}/discount-preview/`)
      .send({ selectedCouponIds: ['unknown'] })
      .set('Accept', 'application/json');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      code: 'RESOURCE_NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다.',
    });
  });
});
