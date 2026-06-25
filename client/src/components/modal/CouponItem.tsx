import styled from "styled-components";
import { CouponData } from "../../type/types";
import { COUPON_NAME } from "../../constants/constants";

interface Props {
  couponData: CouponData;
  isChecked: boolean;
  isDisabled: boolean;
  onToggle: (couponId: number) => void;
}

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-");
  return `${year}년 ${month}월 ${day}일`;
};

export default function CouponItem({
  isChecked,
  couponData,
  isDisabled,
  onToggle,
}: Props) {
  return (
    <Container isDisabled={isDisabled}>
      <TopSection>
        <input
          type="checkbox"
          checked={isChecked}
          disabled={isDisabled}
          onChange={() => onToggle(couponData.couponId)}
        />
        <CouponName>{COUPON_NAME[couponData.couponCode]}</CouponName>
      </TopSection>
      <InfoLine>만료일: {formatDate(couponData.expiredDate)}</InfoLine>
      {couponData.minOrderAmount && (
        <InfoLine>
          최소 주문 금액: {couponData.minOrderAmount.toLocaleString()}원{" "}
        </InfoLine>
      )}
      {couponData.usableStartAt && couponData.usableEndAt && (
        <InfoLine>
          사용 가능 시간: 오전{couponData.usableStartAt}시 부터{" "}
          {couponData.usableEndAt}시 까지
        </InfoLine>
      )}
    </Container>
  );
}

const Container = styled.div<{ isDisabled: boolean }>`
  opacity: ${({ isDisabled }) => (isDisabled ? 0.4 : 1)};
  border-bottom: solid 1px #0000001a;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
`;

const CouponName = styled.p`
  font-size: 16px;
  font-weight: 700;
  font-family: sans-serif;
`;
const InfoLine = styled.p`
  font-size: 12px;
  font-weight: 500;
  font-family: sans-serif;
`;
