import type { CouponType } from './database';

export interface CartItem {
  id?: number;
  price: number;
  quantity: number;
}

export interface Coupon {
  id: number;
  type: CouponType;
  expirationDate: string;
}

export interface CouponStatus {
  id: number;
  applicable: boolean;
}

export interface OrderPreviewResult {
  orderAmount: number;
  couponDiscount: number;
  deliveryFee: number;
  originalDeliveryFee: number;
  totalPrice: number;
  appliedCoupons: number[];
  couponStatuses: CouponStatus[];
}

const DEFAULT_DELIVERY_FEE = 3000;
const REMOTE_AREA_SURCHARGE = 3000;
const FREE_DELIVERY_THRESHOLD = 100000;
const FIXED5000_MIN_AMOUNT = 100000;
const FIXED5000_DISCOUNT = 5000;
const FREESHIPPING_MIN_AMOUNT = 50000;
const MIRACLESALE_RATE = 0.3;
const MIRACLESALE_START_HOUR = 4;
const MIRACLESALE_END_HOUR = 7;

const sumOrderAmount = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// BOGO(2+1): 동일 상품 3개 구매 시 1개 무료. 단가가 가장 높은 상품에 적용.
const BOGO_REQUIRED_QUANTITY = 3;
const bogoDiscount = (items: CartItem[]): number => {
  const eligible = items.filter((item) => item.quantity >= BOGO_REQUIRED_QUANTITY);
  if (eligible.length === 0) return 0;
  return Math.max(...eligible.map((item) => item.price));
};

const isMiracleTime = (now: Date): boolean => {
  const hour = now.getHours();
  return hour >= MIRACLESALE_START_HOUR && hour < MIRACLESALE_END_HOUR;
};

// 쿠폰별 현재 사용 가능 여부. 조건 미충족 시 모달에서 선택을 막기 위해 사용한다.
export const isCouponApplicable = (
  type: CouponType,
  items: CartItem[],
  orderAmount: number,
  expirationDate: string,
  now: Date = new Date(),
): boolean => {
  if (new Date(expirationDate) < now) return false;

  switch (type) {
    case 'FIXED5000':
      return orderAmount >= FIXED5000_MIN_AMOUNT;
    case 'BOGO':
      return items.some((item) => item.quantity >= BOGO_REQUIRED_QUANTITY);
    case 'FREESHIPPING':
      // 50,000원 미만은 자격 미달, 100,000원 이상은 이미 기본 무료배송이라 무의미.
      return orderAmount >= FREESHIPPING_MIN_AMOUNT && orderAmount < FREE_DELIVERY_THRESHOLD;
    case 'MIRACLESALE':
      return isMiracleTime(now);
    default:
      return false;
  }
};

interface ComboResult {
  couponDiscount: number;
  appliedCoupons: number[];
  freeShipping: boolean;
}

// 정액 쿠폰(FIXED5000, BOGO)을 먼저 적용하고, 할인된 금액에 정율 쿠폰(MIRACLESALE)을 적용한다.
const evaluateCombo = (
  combo: Coupon[],
  items: CartItem[],
  orderAmount: number,
  now: Date,
): ComboResult => {
  let runningAmount = orderAmount;
  let couponDiscount = 0;
  let freeShipping = false;
  const applied: number[] = [];

  // 1. 정액 쿠폰
  for (const coupon of combo) {
    if (coupon.type === 'FIXED5000' && orderAmount >= FIXED5000_MIN_AMOUNT) {
      couponDiscount += FIXED5000_DISCOUNT;
      runningAmount -= FIXED5000_DISCOUNT;
      applied.push(coupon.id);
    } else if (coupon.type === 'BOGO') {
      const discount = bogoDiscount(items);
      if (discount > 0) {
        couponDiscount += discount;
        runningAmount -= discount;
        applied.push(coupon.id);
      }
    } else if (coupon.type === 'FREESHIPPING' && orderAmount >= FREESHIPPING_MIN_AMOUNT) {
      freeShipping = true;
      applied.push(coupon.id);
    }
  }

  // 2. 정율 쿠폰 (정액 적용 후 금액 기준)
  for (const coupon of combo) {
    if (coupon.type === 'MIRACLESALE' && isMiracleTime(now)) {
      const discount = Math.floor(runningAmount * MIRACLESALE_RATE);
      if (discount > 0) {
        couponDiscount += discount;
        runningAmount -= discount;
        applied.push(coupon.id);
      }
    }
  }

  return { couponDiscount, appliedCoupons: applied, freeShipping };
};

// 배송비: 기본 3,000원. 주문금액(쿠폰 전) 10만원 이상이면 무료.
// 도서산간 +3,000원. FREESHIPPING 쿠폰은 도서산간 포함 전체 무료.
const calculateDeliveryFee = (
  orderAmount: number,
  isRemoteArea: boolean,
  freeShipping: boolean,
): number => {
  if (freeShipping) return 0;
  let fee = orderAmount >= FREE_DELIVERY_THRESHOLD ? 0 : DEFAULT_DELIVERY_FEE;
  if (isRemoteArea) fee += REMOTE_AREA_SURCHARGE;
  return fee;
};

// 0~2개 쿠폰 조합을 모두 열거한다.
const buildCombos = (candidates: Coupon[]): Coupon[][] => {
  const combos: Coupon[][] = [[]];
  for (let i = 0; i < candidates.length; i++) {
    combos.push([candidates[i]]);
    for (let j = i + 1; j < candidates.length; j++) {
      combos.push([candidates[i], candidates[j]]);
    }
  }
  return combos;
};

/**
 * 선택된 장바구니 항목과 후보 쿠폰으로 최종 결제 정보를 계산한다.
 * 가능한 조합(최대 2개) 중 최종 결제 금액이 가장 낮은 조합을 자동 선택한다.
 */
export const calculateOrderPreview = (
  items: CartItem[],
  candidates: Coupon[],
  isRemoteArea: boolean,
  allCoupons: Coupon[] = candidates,
  now: Date = new Date(),
): OrderPreviewResult => {
  const orderAmount = sumOrderAmount(items);
  const originalDeliveryFee = calculateDeliveryFee(orderAmount, isRemoteArea, false);

  const couponStatuses = allCoupons.map((coupon) => ({
    id: coupon.id,
    applicable: isCouponApplicable(coupon.type, items, orderAmount, coupon.expirationDate, now),
  }));

  let best: OrderPreviewResult | null = null;

  for (const combo of buildCombos(candidates)) {
    const { couponDiscount, appliedCoupons, freeShipping } = evaluateCombo(
      combo,
      items,
      orderAmount,
      now,
    );
    const deliveryFee = calculateDeliveryFee(orderAmount, isRemoteArea, freeShipping);
    const totalPrice = orderAmount - couponDiscount + deliveryFee;

    if (best === null || totalPrice < best.totalPrice) {
      best = {
        orderAmount,
        couponDiscount,
        deliveryFee,
        originalDeliveryFee,
        totalPrice,
        appliedCoupons,
        couponStatuses,
      };
    }
  }

  return best!;
};
