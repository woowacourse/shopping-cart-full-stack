import styled from '@emotion/styled';

interface Props {
  productTypeCount: number;
  totalQuantity: number;
}

export default function OrderHeader({
  productTypeCount,
  totalQuantity,
}: Props) {
  return (
    <Container>
      <Header>
        <Title>주문 확인</Title>
        <Subtitle>
          총 {productTypeCount}종류의 상품 {totalQuantity}개를 주문합니다.
          <br />
          최종 결제 금액을 확인해 주세요.
        </Subtitle>
      </Header>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 62px;
  margin-bottom: 36px;
`;

const Header = styled.div``;

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #000;
`;

const Subtitle = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
`;
