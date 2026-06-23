import type { Coupon, CouponCode } from '../coupon/types';
import { getSelectedCouponCodes } from '../coupon/selector';
import type { Order } from './types';

export type OrderState = {
  order: Order | null;
  isModalOpen: boolean;
  coupons: Coupon[];
  selectedCouponCodes: CouponCode[];
  couponDiscountAmount: number;
};

export const initialOrderState: OrderState = {
  order: null,
  isModalOpen: false,
  coupons: [],
  selectedCouponCodes: [],
  couponDiscountAmount: 0,
};

export type OrderAction =
  | { type: 'RESET_ORDER' }
  | { type: 'SET_ORDER'; order: Order }
  | { type: 'OPEN_COUPON_MODAL' }
  | { type: 'CLOSE_COUPON_MODAL' }
  | { type: 'SET_COUPONS'; coupons: Coupon[] }
  | { type: 'CHANGE_REMOTE_AREA'; isRemoteArea: boolean }
  | { type: 'CHANGE_COUPON_SELECTION'; couponCodes: CouponCode[] }
  | {
      type: 'SET_COUPON_DISCOUNT';
      discountAmount: number;
    };

export function orderReducer(
  state: OrderState,
  action: OrderAction,
): OrderState {
  switch (action.type) {
    case 'RESET_ORDER':
      return initialOrderState;
    case 'SET_ORDER':
      return {
        ...state,
        order: action.order,
        couponDiscountAmount: action.order.amount.discountAmount,
      };
    case 'OPEN_COUPON_MODAL':
      return { ...state, isModalOpen: true };
    case 'CLOSE_COUPON_MODAL':
      return { ...state, isModalOpen: false };
    case 'SET_COUPONS':
      return {
        ...state,
        coupons: action.coupons,
        selectedCouponCodes: getSelectedCouponCodes(action.coupons),
      };
    case 'CHANGE_REMOTE_AREA':
      if (!state.order) return state;

      return {
        ...state,
        order: {
          ...state.order,
          isRemoteArea: action.isRemoteArea,
        },
      };
    case 'CHANGE_COUPON_SELECTION':
      return {
        ...state,
        selectedCouponCodes: action.couponCodes,
      };
    case 'SET_COUPON_DISCOUNT':
      return {
        ...state,
        couponDiscountAmount: action.discountAmount,
      };
    default:
      return state;
  }
}
