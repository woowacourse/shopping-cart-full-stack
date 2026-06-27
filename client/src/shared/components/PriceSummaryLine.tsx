import styled from 'styled-components';

export const PriceSummaryLine = ({
  title,
  value,
}: {
  title: string;
  value: number;
}) => {
  return (
    <LineContainer>
      <Title>{title}</Title>
      <Value>{value.toLocaleString()}원</Value>
    </LineContainer>
  );
};

const LineContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Title = styled.div`
  color: #000000;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.3;
`;

const Value = styled.div`
  color: #000000;
  font-size: 25px;
  font-weight: 700;
  line-height: 1.1;
  text-align: right;
`;
