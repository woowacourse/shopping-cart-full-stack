import styled from '@emotion/styled';

interface OrderSummaryRowProps {
  amount: number;
  label: string;
  prefix?: '+' | '-';
}

const OrderSummaryRow = ({ amount, label, prefix }: OrderSummaryRowProps) => {
  return (
    <Row>
      <Label>{label}</Label>
      <Value>
        {prefix}
        {amount.toLocaleString()}원
      </Value>
    </Row>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
`;

const Label = styled.span`
  font-size: 1rem;
  font-weight: 700;
`;

const Value = styled.strong`
  font-size: 1.5rem;
  font-weight: 700;
`;

export default OrderSummaryRow;
