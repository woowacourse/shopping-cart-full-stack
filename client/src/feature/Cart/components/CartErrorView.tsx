import styled from 'styled-components';

type CartErrorViewProps = {
  error: Error | null;
  onRetry: () => void;
};

export const CartErrorView = ({ error, onRetry }: CartErrorViewProps) => {
  return (
    <ErrorContainer role="alert">
      <Title>장바구니</Title>
      <Content>
        <Message>장바구니 상품을 불러오지 못했습니다.</Message>
        {error && <Description>{error.message}</Description>}
        <RetryButton type="button" onClick={onRetry}>
          다시 시도
        </RetryButton>
      </Content>
    </ErrorContainer>
  );
};

const ErrorContainer = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 430px;
`;

const Title = styled.h1`
  margin: 0;

  color: #000000;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.2;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Message = styled.p`
  margin: 0;

  color: #000000;
  font-size: 15px;
  font-weight: 800;
  text-align: center;
`;

const Description = styled.p`
  max-width: 260px;
  margin: 10px 0 0;

  color: #666666;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
`;

const RetryButton = styled.button`
  margin-top: 18px;
  padding: 9px 14px;
  border: 1px solid #000000;
  border-radius: 4px;

  background-color: #ffffff;
  color: #000000;

  font-size: 13px;
  font-weight: 800;
`;
