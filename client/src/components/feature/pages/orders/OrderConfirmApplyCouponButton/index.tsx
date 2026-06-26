import useOpenCouponModal from "@/hooks/feature/modal/useOpenCouponModal";
import WeakButton from "@components/common/shared/ui/WeakButton";

function OrderConfirmApplyCouponButton() {
  const { openCouponModal } = useOpenCouponModal();

  return (
    <WeakButton fullWidth onClick={openCouponModal}>
      쿠폰 적용
    </WeakButton>
  );
}

export default OrderConfirmApplyCouponButton;
