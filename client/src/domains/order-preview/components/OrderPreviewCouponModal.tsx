import {CouponModal} from './CouponModal.js';
import {useOrderPreviewPage} from '../hooks/useOrderPreviewPage.js';

export const OrderPreviewCouponModal = () => {
  const {actions, couponModal} = useOrderPreviewPage();

  if (!couponModal.isOpen) return null;

  return (
    <CouponModal
      coupons={couponModal.coupons}
      discountAmount={couponModal.discountAmount}
      errorMessage={couponModal.errorMessage}
      selectedCouponIds={couponModal.selectedCouponIds}
      status={couponModal.status}
      onApply={actions.applyCouponSelection}
      onChangeSelectedCouponIds={actions.changeSelectedCouponIds}
      onClose={actions.closeCouponModal}
      onRetry={actions.retryCoupons}
    />
  );
};
