import type {Coupon} from '../types/coupon.js';
import type {Preorder} from '../types/preorder.js';

const getMinutes = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

export const getCouponDisabledReason = (coupon: Coupon, preorder: Preorder, now = new Date()) => {
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

export const calculateCouponDiscount = (coupon: Coupon) => {
  switch (coupon.benefit.type) {
    case 'DISCOUNT_AMOUNT':
      return coupon.benefit.discountAmount;
    default:
      return 0;
  }
};
