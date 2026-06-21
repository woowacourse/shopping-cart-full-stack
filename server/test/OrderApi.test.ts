import {jest} from '@jest/globals';
import request from 'supertest';

const loadApp = async () => {
  jest.resetModules();
  jest.unstable_unmockModule('../src/services/ProductService.js');
  jest.unstable_unmockModule('../src/services/CartService.js');
  jest.unstable_unmockModule('../src/services/PreorderService.js');
  jest.unstable_unmockModule('../src/services/CouponService.js');
  jest.unstable_unmockModule('../src/services/OrderService.js');

  const {default: app} = await import('../src/app.js');

  return app;
};

const createPreorder = async (app: Awaited<ReturnType<typeof loadApp>>, selectedCartIds = ['6']) => {
  const response = await request(app).post('/preorder').send({selectedCartIds}).expect(201);

  return response.body.body.preorderId as string;
};

describe('Preorder API', () => {
  test('POST /preorder는 preorderId를 응답한다', async () => {
    const app = await loadApp();

    const response = await request(app).post('/preorder').send({selectedCartIds: ['6']}).expect(201);

    expect(typeof response.body.body.preorderId).toBe('string');
  });

  test('GET /preorder/:preorderId는 임시 주문 상품 정보를 응답한다', async () => {
    const app = await loadApp();
    const preorderId = await createPreorder(app);

    const response = await request(app).get(`/preorder/${preorderId}`).expect(200);

    expect(response.body).toEqual({
      body: {
        preorderId,
        items: [
          {
            productId: '6',
            price: 89000,
            name: '다중인격 콘티',
            imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=300&q=80',
            quantity: 5,
          },
        ],
      },
    });
  });
});

describe('Coupon API', () => {
  test('GET /coupons는 preorder 기준 쿠폰 목록을 응답한다', async () => {
    const app = await loadApp();
    const preorderId = await createPreorder(app);

    const response = await request(app).get('/coupons').query({preorderId}).expect(200);

    expect(response.body.body.coupons).toHaveLength(4);
    expect(response.body.body.coupons[0]).toMatchObject({
      couponId: 1,
      code: 'FIXED5000',
      disabled: false,
      disabledReason: null,
    });
  });
});

describe('Order API', () => {
  test('POST /order/preview는 결제 예상 금액을 응답한다', async () => {
    const app = await loadApp();
    const preorderId = await createPreorder(app);

    const response = await request(app)
      .post('/order/preview')
      .send({preorderId, isRemoteArea: true, couponIds: [1, 3]})
      .expect(200);

    expect(response.body).toEqual({
      body: {
        price: {
          orderAmount: 445000,
          productDiscountAmount: 5000,
          shippingDiscountAmount: 3000,
          totalDiscountAmount: 8000,
          shippingFee: 0,
          totalPaymentAmount: 440000,
        },
        appliedCoupons: [
          {
            couponId: 1,
            code: 'FIXED5000',
            name: '5000원 할인 쿠폰',
            discountAmount: 5000,
          },
          {
            couponId: 3,
            code: 'FREESHIPPING',
            name: '5만원 이상 구매 시 무료 배송 쿠폰',
            discountAmount: 3000,
          },
        ],
        excludedCoupons: [],
        benefitItems: [],
      },
    });
  });

  test('POST /order는 주문을 생성하고 주문 요약을 조회할 수 있다', async () => {
    const app = await loadApp();
    const preorderId = await createPreorder(app);
    const previewResponse = await request(app)
      .post('/order/preview')
      .send({preorderId, isRemoteArea: true, couponIds: [1, 3]})
      .expect(200);

    const orderResponse = await request(app)
      .post('/order')
      .send({
        preorderId,
        expectedTotalPaymentAmount: previewResponse.body.body.price.totalPaymentAmount,
      })
      .expect(201);

    const orderId = orderResponse.body.body.orderId;
    const orderSummaryResponse = await request(app).get(`/order/${orderId}`).expect(200);
    const cartResponse = await request(app).get('/carts').expect(200);

    expect(typeof orderId).toBe('string');
    expect(orderSummaryResponse.body).toEqual({
      body: {
        itemCount: 1,
        totalQuantity: 5,
        totalAmount: 440000,
      },
    });
    expect(cartResponse.body.body.some((cartItem: {id: string}) => cartItem.id === '6')).toBe(false);
    await request(app).get(`/preorder/${preorderId}`).expect(404);
  });

  test('POST /order는 최종 결제 금액이 다르면 409를 응답한다', async () => {
    const app = await loadApp();
    const preorderId = await createPreorder(app);

    await request(app).post('/order/preview').send({preorderId, isRemoteArea: true, couponIds: [1, 3]}).expect(200);

    const response = await request(app)
      .post('/order')
      .send({
        preorderId,
        expectedTotalPaymentAmount: 1,
      })
      .expect(409);

    expect(response.body).toEqual({
      body: {
        message: '서버에서 다시 계산한 결제 금액이 화면에 표시된 금액과 일치하지 않습니다.',
      },
    });
  });
});
