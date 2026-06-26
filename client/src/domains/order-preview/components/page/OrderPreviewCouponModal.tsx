import {CouponModal} from '../../../coupon/components/CouponModal.js';
import {useOrderPreviewPage} from '../../hooks/useOrderPreviewPage.js';

export const OrderPreviewCouponModal = () => {
  const {couponModal, couponModalActions} = useOrderPreviewPage();

  if (!couponModal.isOpen) return null;

  return (
    <CouponModal
      actions={{
        onApply: couponModalActions.applyCouponSelection,
        onChangeSelectedCouponIds: couponModalActions.changeSelectedCouponIds,
        onClose: couponModalActions.closeCouponModal,
        onRetry: couponModalActions.handleCouponModalError,
      }}
      state={couponModal}
    />
  );
};
