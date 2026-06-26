import styled from "@emotion/styled";
import { useLocation } from "react-router";
import { formatToKoreanPrice } from "../../commons/utils";
import { FixedButton } from "../../commons/styles/Button";

export default function Section() {
  const location = useLocation();

  const { orderItemsTypeLength, orderItemsLength, totalPrice } = location.state;
  return (
    <SectionLayout>
      <Title>결제 확인</Title>
      <SubText>
        총 {orderItemsTypeLength}종류의 상품 {orderItemsLength}개를
        주문했습니다.
      </SubText>
      <SubText>최종 결제 금액을 확인해 주세요.</SubText>

      <MiddleTitle>총 결제 금액</MiddleTitle>
      <TotalPrice>{formatToKoreanPrice(totalPrice)}</TotalPrice>
      <FixedButton>장바구니로 돌아가기</FixedButton>
    </SectionLayout>
  );
}

const SectionLayout = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 24px;
`;

const SubText = styled.p`
  font-weight: 500;
  font-size: 12px;
  margin: 2px 0;
`;

const MiddleTitle = styled.p`
  font-weight: 700;
  font-size: 16px;
`;

const TotalPrice = styled.p`
  font-weight: 700;
  font-size: 24px;
  margin: 4px 0;
`;
