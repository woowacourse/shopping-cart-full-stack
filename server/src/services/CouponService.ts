import {coupons} from '../db.js';
import type {Coupon} from '../data/coupons.js';
import {preorderService} from './PreorderService.js';

type Preorder = ReturnType<typeof preorderService.getPreorder>;

const getMinutes = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

const getDisabledReason = (coupon: Coupon, preorder: Preorder, now = new Date()) => {
  const {condition, expirationDate} = coupon;

  if (expirationDate < now) {
    return '만료된 쿠폰입니다.';
  }

  switch (condition.type) {
    case 'MIN_ORDER_AMOUNT': {
      const orderAmount = preorder.items.reduce((total, item) => total + item.price * item.quantity, 0);

      if (orderAmount < condition.minOrderAmount) {
        return `주문 금액이 ${condition.minOrderAmount.toLocaleString('ko-KR')}원 미만입니다.`;
      }

      return null;
    }
    case 'MIN_SAME_PRODUCT_QUANTITY': {
      const {minSameProductQuantity} = condition;
      const hasEnoughQuantity = preorder.items.some((item) => item.quantity >= minSameProductQuantity);

      if (!hasEnoughQuantity) {
        return `동일 상품을 ${minSameProductQuantity}개 이상 구매해야 합니다.`;
      }

      return null;
    }
    case 'TIME_RANGE': {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = getMinutes(condition.start);
      const endMinutes = getMinutes(condition.end);

      if (currentMinutes < startMinutes || currentMinutes >= endMinutes) {
        return '현재 적용 가능한 시간이 아닙니다.';
      }

      return null;
    }
  }
};

const toCouponResponse = (coupon: Coupon, disabledReason: string | null) => {
  return {
    couponId: coupon.id,
    code: coupon.code,
    name: coupon.name,
    expirationDate: coupon.expirationDate.toISOString(),
    condition: coupon.condition,
    benefit: coupon.benefit,
    disabled: disabledReason !== null,
    disabledReason,
  };
};

export const couponService = {
  getCoupons(preorderId: string) {
    const preorder = preorderService.getPreorder(preorderId);

    return coupons.map((coupon) => {
      const disabledReason = getDisabledReason(coupon, preorder);

      return toCouponResponse(coupon, disabledReason);
    });
  },
};
