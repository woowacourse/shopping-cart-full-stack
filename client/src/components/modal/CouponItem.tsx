import styled from "styled-components";
import { CouponData } from "../../type/types";

interface Props {
  couponData: CouponData;
  isChecked: boolean;
  isDisabled: boolean;
  onToggle: (couponId: number) => void;
}
// couponCode ('FIXED5000' | 'BTGO' | 'FREESHIPPING' | 'MIRACLESALE')에 따라 5000원 할인 쿠폰,  2개 구매 시 1개 무료 쿠폰, 5만원 이상 구매 시 무료 배송 쿠폰, 미라클 모닝 30% 할인 쿠폰 이 couponName

const COUPON_NAME: Record<string, string> = {
  FIXED5000: "5,000원 할인 쿠폰",
  BTGO: "2개 구매 시 1개 무료 쿠폰",
  FREESHIPPING: "5만원 이상 구매 시 무료 배송 쿠폰",
  MIRACLESALE: "미라클 모닝 30% 할인 쿠폰",
};

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
