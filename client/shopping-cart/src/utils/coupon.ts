import type { CouponDescription } from '../types';

export const formatCouponDescription = (description: CouponDescription): string => {
  switch (description.type) {
    case 'EXPIRY_DATE':
      return `만료일: ${description.content.expiresAt}`;
    case 'MIN_ORDER_AMOUNT':
      return `최소 주문 금액: ${description.content.minAmount.toLocaleString('ko-KR')}원`;
    case 'USABLE_TIME':
      return `사용 가능 시간: ${description.content.from} ~ ${description.content.to}`;
    case 'MIN_QUANTITY_PER_PRODUCT':
      return `최소 수량: ${description.content.minQuantity}개`;
  }
};
