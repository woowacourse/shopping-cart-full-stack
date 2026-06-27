import Text from "@components/common/shared/Text";
import Spacing from "@components/common/shared/Spacing";
import styled from "@emotion/styled";
import Flex from "@components/common/shared/Flex";
import useOrderCompleteNavigate from "@hooks/useOrderCompleteNavigate.ts";

export default function OrderConfirmSection() {
  const { getState } = useOrderCompleteNavigate();
  const state = getState() ?? { productCount: 0, totalQuantity: 0, totalAmount: 0 };

  const { productCount, totalQuantity, totalAmount } = state;

  return (
    <Wrapper direction="column" align="center">
      <Text typograph="heading1" as="h2">
        결제 확인
      </Text>
      <Spacing size={1.5} />
      <Description typograph="caption" as="p">
        총 {productCount}종류의 상품 {totalQuantity}개를 주문했습니다.
        <br />
        최종 결제 금액을 확인해 주세요.
      </Description>
      <Spacing size={1.5} />
      <Text typograph="heading2">총 결제 금액</Text>
      <Spacing size={0.75} />
      <Text typograph="heading1">{totalAmount.toLocaleString()}원</Text>
      <Spacing size={7} />
    </Wrapper>
  );
}

const Wrapper = styled(Flex)`
  height: 100%;
  margin: auto;
`;

const Description = styled(Text)`
  text-align: center;
`;
