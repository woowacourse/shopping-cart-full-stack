import styled from "styled-components";

interface Props {
  orderPrice: number;
  deliveryPrice: number;
  totalPrice: number;
}

export default function ResultOrder({
  orderPrice,
  deliveryPrice,
  totalPrice,
}: Props) {
  const format = (price: number) => price.toLocaleString();

  return (
    <Container>
      <Notice>
        <img src="/!_img.jpg" alt="느낌표" />
        <p>총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.</p>
      </Notice>
      <PriceTable>
        <tbody>
          <PriceRow>
            <td>주문 금액</td>
            <td>{format(orderPrice)}원</td>
          </PriceRow>
          <PriceRow>
            <td>배송비</td>
            <td>{format(deliveryPrice)}원</td>
          </PriceRow>
          <TotalRow>
            <td>총 결제 금액</td>
            <td>{format(totalPrice)}원</td>
          </TotalRow>
        </tbody>
      </PriceTable>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #555;
  border-bottom: solid 1px #0000001a;
`;

const PriceTable = styled.table`
  width: 100%;
  font-weight: 700;
  border-collapse: collapse;
`;

const PriceRow = styled.tr`
  td {
    padding: 8px 0;
    font-size: 15px;
  }

  td:last-child {
    text-align: right;
    font-weight: bold;
  }
`;

const TotalRow = styled(PriceRow)`
  border-top: 1px solid #0000001a;

  td {
    padding-top: 16px;
    font-size: 16px;
  }
`;
