import type {CouponsErrorType} from '../../coupon/hooks/useCoupons.js';
import type {OrderPreviewErrorType} from './useOrderPreview.js';

interface UseCouponModalErrorActionParams {
  couponErrorType: CouponsErrorType;
  modalPreviewErrorType: OrderPreviewErrorType;
  onReturnToCart: () => void;
  retryCoupons: () => void;
}

export function useCouponModalErrorAction({
  couponErrorType,
  modalPreviewErrorType,
  onReturnToCart,
  retryCoupons,
}: UseCouponModalErrorActionParams) {
  const shouldReturnToCart = getShouldReturnToCart(couponErrorType, modalPreviewErrorType);

  return {
    errorActionText: shouldReturnToCart ? '장바구니로 돌아가기' : '다시 시도',
    handleCouponModalError: shouldReturnToCart ? onReturnToCart : retryCoupons,
  };
}

function getShouldReturnToCart(couponErrorType: CouponsErrorType, modalPreviewErrorType: OrderPreviewErrorType) {
  return (
    couponErrorType === 'expired' ||
    couponErrorType === 'notFound' ||
    modalPreviewErrorType === 'expired' ||
    modalPreviewErrorType === 'notFound'
  );
}
