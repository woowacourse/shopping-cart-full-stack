import CheckBox from "@components/common/shared/CheckBox";
import Text from "@components/common/shared/Text";
import Flex from "@components/common/shared/Flex";
import Spacing from "@components/common/shared/Spacing";
import Divider from "@components/common/shared/Divider";
import styled from "@emotion/styled";
import type { Coupon } from "@/types/order";

interface CouponItemProps {
  coupon: Coupon;
  disabled: boolean;
  checked: boolean;
  onSelect: () => void;
}

export default function CouponItem({ coupon, disabled, checked, onSelect }: CouponItemProps) {
  const isActuallyDisabled = !coupon.isCouponUsable || disabled;

  return (
    <CouponItemContainer disabled={isActuallyDisabled}>
      <Divider />
      <Spacing size={0.75} />
      <Flex gap={8} align="center">
        <CheckBox disabled={isActuallyDisabled} checked={checked} onChange={onSelect} />
        <CouponItemText typograph="body1" as="h4" disabled={isActuallyDisabled}>
          {coupon.name}
        </CouponItemText>
      </Flex>
      <Spacing size={0.75} />
      <Flex direction="column" gap={4}>
        <CouponItemText typograph="caption" disabled={isActuallyDisabled}>
          만료일: {coupon.expirationDate}
        </CouponItemText>
        {coupon.minOrderAmount != null && (
          <CouponItemText typograph="caption" disabled={isActuallyDisabled}>
            최소 주문 금액: {coupon.minOrderAmount.toLocaleString()}원
          </CouponItemText>
        )}
        {coupon.availableHours != null && (
          <CouponItemText typograph="caption" disabled={isActuallyDisabled}>
            사용 가능 시간: {coupon.availableHours}
          </CouponItemText>
        )}
      </Flex>
      <Spacing size={0.75} />
    </CouponItemContainer>
  );
}

const CouponItemContainer = styled.label<Pick<CouponItemProps, "disabled">>`
  cursor: pointer;
  ${({ disabled }) => disabled && "pointer-events: none"};
`;

const CouponItemText = styled(Text)<Pick<CouponItemProps, "disabled">>`
  opacity: ${({ disabled }) => (disabled ? 0.25 : 1)};
`;
