// GET /order/:orderId -> CouponDB?, ProductDB, OrderDB
// POST /order -> CouponDB, OrderDB
// PATCH /order/:orderId (couponIds) -> CouponDB, OrderDB, ProductDB
// PATCH /order/:orderId (isIsland) -> OrderDB, ProductDB

import { AppError } from '../../../src/errors/AppError.js';
import { couponRepository } from '../../../src/modules/coupons/coupons.repository.js';
import { orderRepository } from '../../../src/modules/orders/orders.repository.js';
import { createOrderService } from '../../../src/modules/orders/orders.service.js';

import { Product } from '../../../src/modules/products/product.model.js';
import { productRepository } from '../../../src/modules/products/product.repository.js';
import { resetTestDatabase, seedProduct } from '../../helpers/testDatabase.js';

const mockProduct = new Product({
  productId: 'product-1',
  productName: '콜라',
  productPrice: 12000,
  remainingQuantity: 25,
  imageUrl: 'src/assets/coke.png',
});

const orderService = createOrderService({
  orderRepository,
  couponRepository,
  productRepository,
  getNow: () => new Date(2026, 5, 18, 12),
});

const expectAppError = (
  callback: () => void,
  expected: { statusCode: number; code: string; message: string },
) => {
  let thrownError: unknown;

  try {
    callback();
  } catch (error) {
    thrownError = error;
  }

  expect(thrownError).toBeInstanceOf(AppError);

  if (thrownError instanceof AppError) {
    expect(thrownError.statusCode).toBe(expected.statusCode);
    expect(thrownError.code).toBe(expected.code);
    expect(thrownError.message).toBe(expected.message);
  }
};

describe('Order Service', () => {
  beforeEach(() => {
    // 상품
    resetTestDatabase();
    seedProduct(mockProduct.productId, mockProduct);
  });

  describe('주문 조회', () => {
    test('orderId로 상품 정보를 포함하여 주문 정보를 조회한다', () => {
      // given
      const createdOrder = orderService.addOrder({
        products: [{ productId: 'product-1', quantity: 3 }],
      });

      // when
      const order = orderService.getOrder(createdOrder.orderId);

      // then
      expect(order.orderId).toBe(createdOrder.orderId);
      expect(order.products).toEqual([
        {
          productId: mockProduct.productId,
          productName: mockProduct.productName,
          productPrice: mockProduct.productPrice,
          imageUrl: mockProduct.imageUrl,
          quantity: 3,
        },
      ]);
      expect(order.couponIds).toEqual(['BOGO']);
      expect(order.isIsland).toBe(false);
    });
    test('주문 금액, 쿠폰 할인 금액, 배송비, 총 결제 금액을 계산해 반환한다', () => {
      const createdOrder = orderService.addOrder({
        products: [{ productId: 'product-1', quantity: 10 }],
      });

      // when
      const order = orderService.getOrder(createdOrder.orderId);

      // then
      expect(order.priceInfo).toEqual({
        orderPrice: 120000,
        productDiscountPrice: 17000,
        deliveryDiscountPrice: 0,
        deliveryFee: 0,
        totalPrice: 103000,
      });
    });
    test('존재하지 않는 orderId면 에러를 반환한다', () => {
      try {
        orderService.getOrder('unknown');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);

        if (error instanceof AppError) {
          expect(error.statusCode).toBe(404);
          expect(error.code).toBe('ORDER_NOT_FOUND');
          expect(error.message).toBe('존재하지 않는 주문입니다.');
        }
      }
    });
  });

  describe('주문 등록', () => {
    test('주문 상품 목록으로 주문을 생성하고 orderId를 반환한다', () => {
      // given
      const createdOrder = orderService.addOrder({
        products: [{ productId: 'product-1', quantity: 3 }],
      });

      // when
      const order = orderService.getOrder(createdOrder.orderId);

      // then
      expect(order.orderId).toBe(createdOrder.orderId);
    });
    test('주문 생성 시 가장 할인 금액이 큰 쿠폰 조합을 자동 적용한다', () => {
      const createdOrder = orderService.addOrder({
        products: [{ productId: 'product-1', quantity: 10 }],
      });

      const order = orderService.getOrder(createdOrder.orderId);

      expect(order.couponIds).toEqual(['FIXED5000', 'BOGO']);
      expect(order.priceInfo.productDiscountPrice).toBe(17000);
    });

    test('존재하지 않는 productId가 포함되면 에러를 반환한다', () => {
      expectAppError(
        () =>
          orderService.addOrder({
            products: [{ productId: 'unknown-product', quantity: 3 }],
          }),
        {
          statusCode: 404,
          code: 'PRODUCT_NOT_FOUND',
          message: '존재하지 않는 상품입니다.',
        },
      );
    });
    test('주문 상품 목록이 비어 있으면 에러를 반환한다', () => {
      expectAppError(
        () =>
          orderService.addOrder({
            products: [],
          }),
        {
          statusCode: 400,
          code: 'EMPTY_ORDER_PRODUCTS',
          message: '주문 상품 목록이 비어 있습니다.',
        },
      );
    });
  });

  describe('쿠폰 적용', () => {
    test('couponIds를 주문에 저장하고 변경된 가격 정보를 반환한다', () => {
      const createdOrder = orderService.addOrder({
        products: [{ productId: 'product-1', quantity: 10 }],
      });

      const order = orderService.applyCoupons(createdOrder.orderId, [
        'FIXED5000',
      ]);

      expect(order.couponIds).toEqual(['FIXED5000']);
      expect(order.priceInfo).toEqual({
        orderPrice: 120000,
        productDiscountPrice: 5000,
        deliveryDiscountPrice: 0,
        deliveryFee: 0,
        totalPrice: 115000,
      });
    });

    test('존재하지 않는 쿠폰 id가 포함되면 에러를 반환한다', () => {
      const createdOrder = orderService.addOrder({
        products: [{ productId: 'product-1', quantity: 10 }],
      });

      expectAppError(
        () => orderService.applyCoupons(createdOrder.orderId, ['UNKNOWN']),
        {
          statusCode: 404,
          code: 'COUPON_NOT_FOUND',
          message: '존재하지 않는 쿠폰입니다.',
        },
      );
    });

    test('적용할 수 없는 쿠폰이면 에러를 반환한다', () => {
      const createdOrder = orderService.addOrder({
        products: [{ productId: 'product-1', quantity: 3 }],
      });

      expectAppError(
        () => orderService.applyCoupons(createdOrder.orderId, ['FIXED5000']),
        {
          statusCode: 400,
          code: 'INVALID_COUPON',
          message: '적용할 수 없는 쿠폰입니다.',
        },
      );
    });

    test('존재하지 않는 orderId면 에러를 반환한다', () => {
      expectAppError(
        () => orderService.applyCoupons('unknown', ['FIXED5000']),
        {
          statusCode: 404,
          code: 'ORDER_NOT_FOUND',
          message: '존재하지 않는 주문입니다.',
        },
      );
    });

    test('쿠폰을 2개 초과하여 선택하면 에러를 반환한다', () => {
      const createdOrder = orderService.addOrder({
        products: [{ productId: 'product-1', quantity: 10 }],
      });

      expectAppError(
        () =>
          orderService.previewCouponDiscount(createdOrder.orderId, [
            'FIXED5000',
            'BOGO',
            'FREESHIPPING',
          ]),
        {
          statusCode: 400,
          code: 'EXCEEDS_MAX_COUPON_COUNT',
          message: '쿠폰은 최대 2개까지만 적용할 수 있습니다.',
        },
      );
    });
  });

  describe('쿠폰 할인 미리보기', () => {
    test('선택한 쿠폰의 할인 금액을 계산하고 주문의 쿠폰 상태는 변경하지 않는다', () => {
      const createdOrder = orderService.addOrder({
        products: [{ productId: 'product-1', quantity: 10 }],
      });

      const discount = orderService.previewCouponDiscount(
        createdOrder.orderId,
        ['FIXED5000'],
      );
      const order = orderService.getOrder(createdOrder.orderId);

      expect(discount).toEqual({
        couponIds: ['FIXED5000'],
        productDiscountPrice: 5000,
        deliveryDiscountPrice: 0,
        totalDiscountPrice: 5000,
      });
      expect(order.couponIds).toEqual(['FIXED5000', 'BOGO']);
    });

    test('적용할 수 없는 쿠폰이면 에러를 반환한다', () => {
      const createdOrder = orderService.addOrder({
        products: [{ productId: 'product-1', quantity: 3 }],
      });

      expectAppError(
        () =>
          orderService.previewCouponDiscount(createdOrder.orderId, [
            'FIXED5000',
          ]),
        {
          statusCode: 400,
          code: 'INVALID_COUPON',
          message: '적용할 수 없는 쿠폰입니다.',
        },
      );
    });
  });

  describe('배송 지역 변경', () => {
    test('도서산간 지역 여부를 변경하고 변경된 가격 정보를 반환한다', () => {
      const createdOrder = orderService.addOrder({
        products: [{ productId: 'product-1', quantity: 3 }],
      });

      const order = orderService.changeDeliveryArea(createdOrder.orderId, true);

      expect(order.isIsland).toBe(true);
      expect(order.priceInfo).toEqual({
        orderPrice: 36000,
        productDiscountPrice: 12000,
        deliveryDiscountPrice: 0,
        deliveryFee: 6000,
        totalPrice: 30000,
      });
    });

    test('존재하지 않는 orderId면 에러를 반환한다', () => {
      expectAppError(() => orderService.changeDeliveryArea('unknown', true), {
        statusCode: 404,
        code: 'ORDER_NOT_FOUND',
        message: '존재하지 않는 주문입니다.',
      });
    });
  });
});
