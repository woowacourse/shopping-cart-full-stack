import * as orderCheckRepository from '../repositories/OrderCheckRepository.js';
import { jest } from '@jest/globals';
import { BadRequestError } from '../errors.js';
import { getBestDiscountCouponCombination, getDisCountAmount, selectCoupon } from './CouponService.js';

const createOrderCheck = async (
    userId: string,
    products: Array<{
        id: string;
        name: string;
        price: number;
        imgUrl: string;
        quantity: number;
    }>,
    remoteAreaCheckStatus = false
) => {
    const order = await orderCheckRepository.createOrder(userId, products);

    if (remoteAreaCheckStatus) {
        await orderCheckRepository.setRemoteAreaCheckStatus(order, true);
    }

    return order;
};

describe('CouponService', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-06-18T05:00:00+09:00'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('정액 쿠폰을 적용한 뒤 정률 쿠폰을 적용한다.', async () => {
        await createOrderCheck('coupon-user-fixed-and-percentage', [
            { id: '1', name: '망고', price: 60000, imgUrl: 'https://example.com/mango.png', quantity: 2 },
        ]);

        await expect(getDisCountAmount(['FIXED5000', 'MIRACLESALE'], 'coupon-user-fixed-and-percentage')).resolves.toBe(
            39500
        );
    });

    it('무료 배송 쿠폰은 기본 배송비와 도서산간 추가 배송비를 함께 할인한다.', async () => {
        await createOrderCheck(
            'coupon-user-free-shipping',
            [{ id: '1', name: '망고', price: 35000, imgUrl: 'https://example.com/mango.png', quantity: 2 }],
            true
        );

        await expect(getDisCountAmount(['FREESHIPPING', 'MIRACLESALE'], 'coupon-user-free-shipping')).resolves.toBe(
            27000
        );
    });

    it('사용 가능한 쿠폰 중 할인액이 가장 큰 2개 조합을 고른다.', async () => {
        await createOrderCheck('coupon-user-best-combination', [
            { id: '1', name: '프리미엄 망고', price: 50000, imgUrl: 'https://example.com/mango.png', quantity: 3 },
        ]);

        await expect(getBestDiscountCouponCombination('coupon-user-best-combination')).resolves.toEqual({
            couponIds: ['BOGO', 'MIRACLESALE'],
            discountAmount: 80000,
        });
    });

    it('같은 쿠폰을 중복 선택할 수 없다.', async () => {
        await createOrderCheck('coupon-user-duplicate-selection', [
            { id: '1', name: '망고', price: 60000, imgUrl: 'https://example.com/mango.png', quantity: 2 },
        ]);

        await expect(
            selectCoupon(['FIXED5000', 'FIXED5000'], 'coupon-user-duplicate-selection')
        ).rejects.toBeInstanceOf(BadRequestError);
    });
});
