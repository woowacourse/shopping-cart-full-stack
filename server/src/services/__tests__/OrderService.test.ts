import {jest} from '@jest/globals';

const loadOrderServices = async () => {
  jest.resetModules();
  const {preorderService} = await import('../PreorderService.js');
  const {orderService} = await import('../OrderService.js');
  const {cartItems} = await import('../../repositories/index.js');

  return {
    preorderService,
    orderService,
    cartItems,
  };
};

const createPreorder = async () => {
  const {preorderService, orderService, cartItems} = await loadOrderServices();
  const preorderId = preorderService.createPreorder({selectedCartIds: ['6']});

  return {
    preorderId,
    preorderService,
    orderService,
    cartItems,
  };
};

describe('orderService.previewOrder', () => {
  test('선택한 쿠폰과 배송 조건으로 결제 금액 미리보기를 계산한다', async () => {
    const {preorderId, orderService} = await createPreorder();

    const orderPreview = orderService.previewOrder({
      preorderId,
      isRemoteArea: true,
      couponIds: [1, 3],
    });

    expect(orderPreview).toEqual({
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
    });
  });

  test('요청 값이 유효하지 않으면 에러를 던진다', async () => {
    const {orderService} = await loadOrderServices();

    expect(() => orderService.previewOrder({preorderId: '', isRemoteArea: false, couponIds: []})).toThrow(
      '주문 미리보기 요청 값을 올바르게 입력해주세요.'
    );
    expect(() => orderService.previewOrder({preorderId: '1', isRemoteArea: false, couponIds: [1, 2, 3]})).toThrow(
      '주문 미리보기 요청 값을 올바르게 입력해주세요.'
    );
  });

  test('존재하지 않는 쿠폰은 excludedCoupons에 포함한다', async () => {
    const {preorderId, orderService} = await createPreorder();

    const orderPreview = orderService.previewOrder({
      preorderId,
      isRemoteArea: false,
      couponIds: [999],
    });

    expect(orderPreview.excludedCoupons).toEqual([
      {
        couponId: 999,
        code: '',
        name: '',
        excludedReason: '존재하지 않는 쿠폰입니다.',
      },
    ]);
  });

  test('이미 무료 배송이면 무료 배송 쿠폰은 excludedCoupons에 포함한다', async () => {
    const {preorderId, orderService} = await createPreorder();

    const orderPreview = orderService.previewOrder({
      preorderId,
      isRemoteArea: false,
      couponIds: [3],
    });

    expect(orderPreview).toEqual({
      price: {
        orderAmount: 445000,
        productDiscountAmount: 0,
        shippingDiscountAmount: 0,
        totalDiscountAmount: 0,
        shippingFee: 0,
        totalPaymentAmount: 445000,
      },
      appliedCoupons: [],
      excludedCoupons: [
        {
          couponId: 3,
          code: 'FREESHIPPING',
          name: '5만원 이상 구매 시 무료 배송 쿠폰',
          excludedReason: '이미 무료 배송이 적용된 주문입니다.',
        },
      ],
      benefitItems: [],
    });
  });

  test('2+1 쿠폰이 적용되면 무료 증정 상품 정보를 포함한다', async () => {
    const {preorderId, orderService} = await createPreorder();

    const orderPreview = orderService.previewOrder({
      preorderId,
      isRemoteArea: false,
      couponIds: [2],
    });

    expect(orderPreview).toEqual({
      price: {
        orderAmount: 534000,
        productDiscountAmount: 89000,
        shippingDiscountAmount: 0,
        totalDiscountAmount: 89000,
        shippingFee: 0,
        totalPaymentAmount: 445000,
      },
      appliedCoupons: [
        {
          couponId: 2,
          code: 'BOGO',
          name: '2개 구매 시 1개 무료 쿠폰',
          discountAmount: 89000,
        },
      ],
      excludedCoupons: [],
      benefitItems: [
        {
          productId: '6',
          quantity: 1,
        },
      ],
    });
  });

  test('preorder를 찾을 수 없으면 에러를 던진다', async () => {
    const {orderService} = await loadOrderServices();

    expect(() => orderService.previewOrder({preorderId: 'unknown', isRemoteArea: false, couponIds: []})).toThrow(
      '주문 확인 정보를 찾을 수 없습니다.'
    );
  });
});

describe('orderService.createOrder', () => {
  test('마지막 결제 금액 미리보기 조건으로 주문을 생성하고 preorder를 삭제한다', async () => {
    const {preorderId, preorderService, orderService, cartItems} = await createPreorder();
    const orderPreview = orderService.previewOrder({
      preorderId,
      isRemoteArea: true,
      couponIds: [1, 3],
    });

    const order = orderService.createOrder({
      preorderId,
      expectedTotalPaymentAmount: orderPreview.price.totalPaymentAmount,
    });

    expect(typeof order.orderId).toBe('string');
    expect(orderService.getOrderSummary(order.orderId)).toEqual({
      itemCount: 1,
      totalQuantity: 5,
      totalAmount: 440000,
    });
    expect(cartItems.findById('6')).toBeUndefined();
    expect(() => preorderService.getPreorder(preorderId)).toThrow('주문 확인 정보를 찾을 수 없습니다.');
  });

  test('2+1 쿠폰으로 생성된 주문은 무료 증정 수량을 주문 요약에 포함한다', async () => {
    const {preorderId, orderService} = await createPreorder();
    const orderPreview = orderService.previewOrder({
      preorderId,
      isRemoteArea: false,
      couponIds: [2],
    });

    const order = orderService.createOrder({
      preorderId,
      expectedTotalPaymentAmount: orderPreview.price.totalPaymentAmount,
    });

    expect(orderService.getOrderSummary(order.orderId)).toEqual({
      itemCount: 1,
      totalQuantity: 6,
      totalAmount: 445000,
    });
  });

  test('요청 값이 유효하지 않으면 에러를 던진다', async () => {
    const {orderService} = await loadOrderServices();

    expect(() => orderService.createOrder({preorderId: '', expectedTotalPaymentAmount: 1000})).toThrow(
      '주문 생성 요청 값을 올바르게 입력해주세요.'
    );
    expect(() => orderService.createOrder({preorderId: '1', expectedTotalPaymentAmount: '1000'})).toThrow(
      '주문 생성 요청 값을 올바르게 입력해주세요.'
    );
  });

  test('결제 금액 미리보기를 먼저 진행하지 않으면 에러를 던진다', async () => {
    const {preorderId, orderService} = await createPreorder();

    expect(() => orderService.createOrder({preorderId, expectedTotalPaymentAmount: 1000})).toThrow(
      '결제 금액 미리보기를 먼저 진행해주세요.'
    );
  });

  test('클라이언트 결제 금액과 서버 재계산 금액이 다르면 에러를 던진다', async () => {
    const {preorderId, orderService} = await createPreorder();
    orderService.previewOrder({
      preorderId,
      isRemoteArea: true,
      couponIds: [1, 3],
    });

    expect(() => orderService.createOrder({preorderId, expectedTotalPaymentAmount: 1})).toThrow(
      '서버에서 다시 계산한 결제 금액이 화면에 표시된 금액과 일치하지 않습니다.'
    );
  });
});

describe('orderService.getOrderSummary', () => {
  test('존재하지 않는 주문이면 에러를 던진다', async () => {
    const {orderService} = await loadOrderServices();

    expect(() => orderService.getOrderSummary('unknown')).toThrow('주문 정보를 찾을 수 없습니다.');
  });
});
