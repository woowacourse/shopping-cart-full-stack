import { css } from "@emotion/react";
import InfoIcon from "../../assets/info.svg?react";
import { useCalculateCoupon } from "../../hooks/useCalculateCoupon";
import { useCouponPolicy } from "../../hooks/useCouponPolicy";
import type { Coupon } from "../../domain/coupon";
import Button from "../Button";
import Modal from "../Modal";
import Loader from "../Loader";
import CouponItem from "./CouponItem";
import { formatPrice } from "../../utils/format";

interface CouponModalProps {
  checkoutId: number;
  couponList: Coupon[];
  initialCouponDiscount: number;
  onApplyCoupon: (selectedCouponIds: number[]) => Promise<void>;
  onClose: () => void;
}

export default function CouponModal({
  checkoutId,
  couponList,
  initialCouponDiscount,
  onApplyCoupon,
  onClose,
}: CouponModalProps) {
  const { maxCouponCount } = useCouponPolicy();
  const initialCouponIds = couponList.filter((coupon) => coupon.isSelected).map((coupon) => coupon.id);

  const { isPending, isDirty, selectedCouponIds, toggleCouponCheckBox, estimatedCouponDiscount } = useCalculateCoupon(
    checkoutId,
    initialCouponIds,
    initialCouponDiscount,
  );

  const isCouponChecked = (id: number) => selectedCouponIds.includes(id);

  const isCouponDisabled = (coupon: Coupon) => {
    if (coupon.disabled) return true;
    return !selectedCouponIds.includes(coupon.id) && selectedCouponIds.length >= maxCouponCount;
  };

  const handleApplyCoupon = async () => {
    try {
      await onApplyCoupon(selectedCouponIds);
      onClose();
    } catch {
      // 닫지 않는다. 갱신된 couponList가 props로 다시 흘러들어와 재렌더된다.
    }
  };

  return (
    <Modal height="614px" onDimmedClick={onClose}>
      <Modal.Header>
        <h1 className="typo-lg-b">쿠폰을 선택해 주세요</h1>
        <Modal.CloseButton onClick={onClose} />
      </Modal.Header>
      <Modal.Main>
        <p className="typo-sm-r" css={infoStyle}>
          <InfoIcon /> 쿠폰은 최대 {maxCouponCount}개까지 사용할 수 있습니다.
        </p>
        <ul css={couponListStyle}>
          {couponList.map((coupon) => (
            <li key={coupon.id}>
              <CouponItem
                coupon={coupon}
                isChecked={isCouponChecked(coupon.id)}
                disabled={isCouponDisabled(coupon)}
                onChange={(checked) => toggleCouponCheckBox(coupon.id, checked)}
              />
            </li>
          ))}
        </ul>
      </Modal.Main>
      <Modal.Footer>
        <div css={applyButtonWrapperStyle}>
          <Button radius="sm" disabled={isPending || !isDirty} onClick={handleApplyCoupon}>
            {isPending ? (
              <Loader />
            ) : (
              <span className="typo-md-b">총 {formatPrice(estimatedCouponDiscount)} 할인 쿠폰 사용하기</span>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

const infoStyle = css`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
`;

const couponListStyle = css`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const applyButtonWrapperStyle = css`
  height: 44px;
`;
