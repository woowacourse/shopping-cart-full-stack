import styled from '@emotion/styled';
import CheckBox from '../CheckBox/CheckBox';

export default function RemoteAreaShippingToggle({
  isSelected,
  onToggle,
}: {
  isSelected: boolean;
  onToggle: (next: boolean) => void;
}) {
  const handleSelect = async () => {
    const next = !isSelected;
    onToggle(next);
  };

  return (
    <Container>
      <Title>배송 정보</Title>
      <Toggle>
        <CheckBox isSelected={isSelected} onSelect={handleSelect} />
        <Text>제주도 및 도서 산간 지역</Text>
      </Toggle>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-bottom: 32px;
`;

const Title = styled.strong`
  font-size: 16px;
  font-weight: 700;
  color: #0a0d13;
`;

const Toggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #0a0d13;
`;

const Text = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
`;
