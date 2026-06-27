import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Description } from '../../../shared/styles/common';

export const OrderErrorView = ({ error }: { error: Error }) => {
  const navigate = useNavigate();

  return (
    <ErrorContainer>
      <Message>주문 정보를 확인할 수 없어요.</Message>
      <Description>
        {error.message || '잠시 후 다시 시도해 주세요.'}
      </Description>
      <BackButton type="button" onClick={() => navigate('/cart')}>
        장바구니로 돌아가기
      </BackButton>
    </ErrorContainer>
  );
};

const ErrorContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 430px;
`;

const Message = styled.p`
  margin: 0;

  color: #000000;
  font-size: 18px;
  font-weight: 800;
  text-align: center;
`;

const BackButton = styled.button`
  margin-top: 20px;
  padding: 10px 16px;
  border: 1px solid #000000;
  border-radius: 4px;

  background-color: #ffffff;
  color: #000000;
  font-size: 13px;
  font-weight: 800;
`;
