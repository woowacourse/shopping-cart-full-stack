import OrderSheet from '../models/OrderSheet.js';

describe('OrderSheet Tests', () => {
  test('주문서 클래스를 객체 형태로 반환한다.', () => {
    const orderSheet = new OrderSheet('user-1', [
      {
        product: {
          id: 'product-1',
          name: '피자',
          price: 30000,
          thumbnail: 'pizza.png',
        },
        quantity: 2,
      },
      {
        product: {
          id: 'product-2',
          name: '치킨',
          price: 20000,
          thumbnail: 'chicken.png',
        },
        quantity: 1,
      },
    ]);

    expect(orderSheet.toObject()).toEqual(
      expect.objectContaining({
        userId: 'user-1',
        items: [
          {
            product: {
              id: 'product-1',
              name: '피자',
              price: 30000,
              thumbnail: 'pizza.png',
            },
            quantity: 2,
          },
          {
            product: {
              id: 'product-2',
              name: '치킨',
              price: 20000,
              thumbnail: 'chicken.png',
            },
            quantity: 1,
          },
        ],
        selectedCouponIds: [],
        isRemoteShippingArea: false,
      }),
    );
  });

  test('도서산간 지역 여부를 수정한다.', () => {
    const orderSheet = new OrderSheet('user-1', [
      {
        product: {
          id: 'product-1',
          name: '피자',
          price: 30000,
          thumbnail: 'pizza.png',
        },
        quantity: 2,
      },
    ]);

    orderSheet.updateShippingArea(true);

    expect(orderSheet.toObject()).toEqual(
      expect.objectContaining({
        isRemoteShippingArea: true,
      }),
    );
  });

  test('선택한 쿠폰을 수정한다.', () => {
    const orderSheet = new OrderSheet('user-1', [
      {
        product: {
          id: 'product-1',
          name: '피자',
          price: 30000,
          thumbnail: 'pizza.png',
        },
        quantity: 2,
      },
    ]);

    orderSheet.updateCouponIds(['coupon-1', 'coupon-2']);

    expect(orderSheet.toObject()).toEqual(
      expect.objectContaining({
        selectedCouponIds: ['coupon-1', 'coupon-2'],
      }),
    );
  });
});
