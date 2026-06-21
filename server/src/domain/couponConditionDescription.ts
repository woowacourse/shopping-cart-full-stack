import type {CouponCondition} from '../types/coupon.js';

const formatTime = (time: string) => {
  const [hour] = time.split(':').map(Number);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour <= 12 ? hour : hour - 12;

  return `${period} ${displayHour}시`;
};

export const getConditionDescription = (condition: CouponCondition): string | null => {
  switch (condition.rule) {
    case 'MIN_ORDER_AMOUNT':
      return `최소 주문 금액: ${condition.params.minOrderAmount.toLocaleString('ko-KR')}원`;
    case 'MIN_SAME_PRODUCT_QUANTITY':
      return null;
    case 'TIME_RANGE':
      return `사용 가능 시간: ${formatTime(condition.params.start)}부터 ${formatTime(condition.params.end)}까지`;
  }
};
