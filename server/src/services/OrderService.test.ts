import {InvalidInputError, NotFoundError} from '../errors/HttpError.js';
import {InMemoryCartItemRepository} from '../repositories/memory/InMemoryCartItemRepository.js';
import {InMemoryCouponRepository} from '../repositories/memory/InMemoryCouponRepository.js';
import {InMemoryProductRepository} from '../repositories/memory/InMemoryProductRepository.js';
import {createOrderService} from './OrderService.js';

const createService = () => {
  const cartItemRepository = new InMemoryCartItemRepository();
  const productRepository = new InMemoryProductRepository();
  const couponRepository = new InMemoryCouponRepository();
  const orderService = createOrderService({cartItemRepository, productRepository, couponRepository});

  return {orderService};
};

const MANUAL = {mode: 'manual' as const};
const AUTO = {mode: 'auto' as const};

describe('orderService.previewOrder', () => {
  test('선택 상품으로 주문금액·배송비·결제금액을 계산한다', async () => {
    const {orderService} = createService();

    // cartItem '1' → product '1' (price 100000000000, qty 1)
    const result = await orderService.previewOrder(
      {selectedItemIds: ['1'], coupons: [], isRemoteArea: false},
      MANUAL,
    );

    expect(result.orderAmount).toBe(100000000000);
    expect(result.deliveryFee).toBe(0); // 10만 이상 무료
    expect(result.couponDiscount).toBe(0);
    expect(result.totalPrice).toBe(100000000000);
    expect(result.appliedCoupons).toEqual([]);
  });

  test('FIXED5000 쿠폰을 적용한다', async () => {
    const {orderService} = createService();

    const result = await orderService.previewOrder(
      {selectedItemIds: ['1'], coupons: ['1'], isRemoteArea: false},
      MANUAL,
    );

    expect(result.couponDiscount).toBe(5000);
    expect(result.appliedCoupons).toEqual(['1']);
  });

  describe('검증 (400)', () => {
    test('selectedItemIds가 비어있으면 InvalidInputError', async () => {
      const {orderService} = createService();

      await expect(
        orderService.previewOrder({selectedItemIds: [], coupons: [], isRemoteArea: false}, MANUAL),
      ).rejects.toThrow(InvalidInputError);
    });

    test('isRemoteArea가 불리언이 아니면 InvalidInputError', async () => {
      const {orderService} = createService();

      await expect(
        orderService.previewOrder({selectedItemIds: ['1'], coupons: []}, MANUAL),
      ).rejects.toThrow(InvalidInputError);
    });

    test('manual 모드에서 쿠폰이 2개를 초과하면 InvalidInputError', async () => {
      const {orderService} = createService();

      await expect(
        orderService.previewOrder(
          {selectedItemIds: ['1'], coupons: ['1', '2', '3'], isRemoteArea: false},
          MANUAL,
        ),
      ).rejects.toThrow(InvalidInputError);
    });

    test('auto 모드에서는 쿠폰을 2개 초과로 받을 수 있다', async () => {
      const {orderService} = createService();

      const result = await orderService.previewOrder(
        {selectedItemIds: ['1'], coupons: ['1', '2', '3', '4'], isRemoteArea: false},
        AUTO,
      );

      // 후보가 4개여도 서버가 최적 ≤2 조합을 선택한다
      expect(result.appliedCoupons.length).toBeLessThanOrEqual(2);
    });
  });

  describe('검증 (404)', () => {
    test('존재하지 않는 장바구니 항목이면 NotFoundError', async () => {
      const {orderService} = createService();

      await expect(
        orderService.previewOrder({selectedItemIds: ['999'], coupons: [], isRemoteArea: false}, MANUAL),
      ).rejects.toThrow(NotFoundError);
    });

    test('존재하지 않는 쿠폰이면 NotFoundError', async () => {
      const {orderService} = createService();

      await expect(
        orderService.previewOrder({selectedItemIds: ['1'], coupons: ['999'], isRemoteArea: false}, MANUAL),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
