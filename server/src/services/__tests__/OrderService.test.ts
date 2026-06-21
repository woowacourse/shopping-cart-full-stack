import {jest} from '@jest/globals';

const loadOrderServices = async () => {
  jest.resetModules();
  const {preorderService} = await import('../PreorderService.js');
  const {orderService} = await import('../OrderService.js');

  return {
    preorderService,
    orderService,
  };
};

const createPreorder = async () => {
  const {preorderService, orderService} = await loadOrderServices();
  const preorderId = preorderService.createPreorder({selectedCartIds: ['6']});

  return {
    preorderId,
    preorderService,
    orderService,
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
          name: '무료 배송 쿠폰',
          discountAmount: 3000,
        },
      ],
      excludedCoupons: [],
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

  test('preorder를 찾을 수 없으면 에러를 던진다', async () => {
    const {orderService} = await loadOrderServices();

    expect(() => orderService.previewOrder({preorderId: 'unknown', isRemoteArea: false, couponIds: []})).toThrow(
      '주문 확인 정보를 찾을 수 없습니다.'
    );
  });
});

describe('orderService.createOrder', () => {
  test('마지막 결제 금액 미리보기 조건으로 주문을 생성하고 preorder를 삭제한다', async () => {
    const {preorderId, preorderService, orderService} = await createPreorder();
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
    expect(() => preorderService.getPreorder(preorderId)).toThrow('주문 확인 정보를 찾을 수 없습니다.');
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
