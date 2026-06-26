import styled from '@emotion/styled';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  overflow-y: scroll;
`;

export const ContainerWrapper = styled.div`
  width: 100%;
  max-width: 430px;
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  padding-bottom: 64px;
`;

export const TopHeaderBar = styled.div`
  width: 100%;
  height: 64px;
  background-color: #000000;
`;

export const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const OrderTitle = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 24px;
`;

export const OrderDescription = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
  text-align: center;
  margin-bottom: 36px;
  line-height: 1.5;
  white-space: pre-line;
`;

export const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

export const PriceLabel = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: #0a0d13;
`;

export const PriceValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: #000000;
`;

export const BottomSection = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 430px;
`;

export const ReturnButton = styled.button`
  width: 100%;
  height: 64px;
  background-color: #000000;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #222222;
  }
`;
