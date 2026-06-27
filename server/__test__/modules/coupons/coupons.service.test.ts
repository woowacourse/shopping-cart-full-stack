import { AppError } from '../../../src/errors/AppError.js';
import { couponRepository } from '../../../src/modules/coupons/coupons.repository.js';
import { createCouponService } from '../../../src/modules/coupons/coupons.service.js';
import { Order } from '../../../src/modules/orders/orders.model.js';
import { orderRepository } from '../../../src/modules/orders/orders.repository.js';
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

const createTestCouponService = (now = new Date('2026-06-14T06:00:00')) =>
  createCouponService({
    orderRepository,
    couponRepository,
    productRepository,
    getNow: () => now,
  });

const seedOrder = ({ quantity }: { quantity: number }) => {
  const order = new Order({
    orderId: 'order-1',
    products: [{ productId: mockProduct.productId, quantity }],
    couponIds: [],
  });

  orderRepository.save(order);

  return order;
};

describe('Coupon Service', () => {
  beforeEach(() => {
    resetTestDatabase();
    seedProduct(mockProduct.productId, mockProduct);
  });

  describe('쿠폰 목록 조회', () => {
    test('주문 기준으로 사용 가능 여부를 포함한 쿠폰 목록과 사용된 쿠폰ID를 함께 반환한다', () => {
      seedOrder({ quantity: 10 });
      const couponService = createTestCouponService();

      const response = couponService.getCoupons('order-1');

      expect(response.couponList).toHaveLength(4);
      expect(
        response.couponList.map(({ couponId, isDisabled }) => ({
          couponId,
          isDisabled,
        })),
      ).toEqual([
        { couponId: 'FIXED5000', isDisabled: false },
        { couponId: 'BOGO', isDisabled: false },
        { couponId: 'FREESHIPPING', isDisabled: false },
        { couponId: 'MIRACLESALE', isDisabled: false },
      ]);
    });

    test('불러온 시점에 사용할 수 없는 쿠폰은 isDisabled true로 반환한다', () => {
      seedOrder({ quantity: 2 });
      const couponService = createTestCouponService(
        new Date('2026-06-14T10:00:00'),
      );

      const response = couponService.getCoupons('order-1');

      expect(
        response.couponList.map(({ couponId, isDisabled }) => ({
          couponId,
          isDisabled,
        })),
      ).toEqual([
        { couponId: 'FIXED5000', isDisabled: true },
        { couponId: 'BOGO', isDisabled: true },
        { couponId: 'FREESHIPPING', isDisabled: true },
        { couponId: 'MIRACLESALE', isDisabled: true },
      ]);
    });

    test('쿠폰 응답에는 이름, 설명, 만료일을 포함한다', () => {
      seedOrder({ quantity: 10 });
      const couponService = createTestCouponService();

      const response = couponService.getCoupons('order-1');

      expect(response.couponList[0]).toEqual({
        couponId: 'FIXED5000',
        couponName: '5,000원 할인 쿠폰',
        couponDescription: '최소 주문 금액: 100,000원',
        isDisabled: false,
        couponExpiration: new Date('2026-11-30T23:59:59'),
      });
    });

    test('존재하지 않는 orderId로 조회하면 에러를 반환한다', () => {
      const couponService = createTestCouponService();

      expect(() => couponService.getCoupons('unknown-order')).toThrow(AppError);

      try {
        couponService.getCoupons('unknown-order');
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
});
