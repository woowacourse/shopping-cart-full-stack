import {CouponModal} from '../../../coupon/components/CouponModal.js';
import {useOrderPreviewPage} from '../../hooks/useOrderPreviewPage.js';

export const OrderPreviewCouponModal = () => {
  const {actions, couponModal} = useOrderPreviewPage();

  if (!couponModal.isOpen) return null;

  return (
    <CouponModal
      actions={{
        onApply: actions.applyCouponSelection,
        onChangeSelectedCouponIds: actions.changeSelectedCouponIds,
        onClose: actions.closeCouponModal,
        onRetry: actions.handleCouponModalError,
      }}
      state={couponModal}
    />
  );
};
