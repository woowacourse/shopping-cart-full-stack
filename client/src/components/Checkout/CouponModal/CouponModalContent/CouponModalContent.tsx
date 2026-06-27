import type { CouponResponseDto } from "../../../../apis/coupon.api.dto";
import Row from "../../../../commons/layout/Row/Row";
import SelectionCheckbox from "../../../../commons/SelectionCheckbox/SelectionCheckbox";
import { useCouponSelection } from "../../../../hooks/useCouponSelection";
import infoIcon from "../../../../assets/info-icon.png";
import {
  CouponInfo,
  CouponItem,
  CouponItemTitle,
  CouponDescription,
  CompleteButton,
} from "./CouponModalContent.styles";

interface Props {
  data: CouponResponseDto;
  onClose: () => void;
  refetch: () => Promise<void>;
}

const CouponModalContent = ({ data, onClose, refetch }: Props) => {
  const { selectedCouponIds, toggleCoupon, completeSelection, totalDiscount } =
    useCouponSelection(
      data.couponResponses,
      data.totalPrice,
      data.bestCombination,
    );

  const handleComplete = async () => {
    completeSelection();
    onClose();
    await refetch();
  };

  return (
    <>
      <CouponInfo>
        <img src={infoIcon} alt="정보 아이콘" />
        <p>쿠폰은 최대 2개까지 사용할 수 있습니다.</p>
      </CouponInfo>

      {data.couponResponses.map((coupon) => {
        const isChecked = selectedCouponIds.includes(coupon.id);

        return (
          <CouponItem key={coupon.id}>
            <Row gap={8}>
              <SelectionCheckbox
                isChecked={isChecked}
                disabled={!coupon.isUsable}
                onClick={() => toggleCoupon(coupon.id, coupon.isUsable)}
              />
              <CouponItemTitle>{coupon.name}</CouponItemTitle>
            </Row>
            <CouponDescription>
              {coupon.description.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </CouponDescription>
          </CouponItem>
        );
      })}

      <CompleteButton type="button" onClick={handleComplete}>
        총 {totalDiscount.toLocaleString()}원 할인 쿠폰 사용하기
      </CompleteButton>
    </>
  );
};

export default CouponModalContent;
