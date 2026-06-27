import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 24px 72px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const Title = styled.h1`
  margin: 0 0 24px;
  font-size: 24px;
  font-weight: 900;
  line-height: 1.3;
`;

export const Description = styled.div`
  margin-bottom: 28px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.55;

  p {
    margin: 0;
  }
`;

export const PaymentSummary = styled.div`
  font-size: 16px;
  font-weight: 900;
  line-height: 1.4;

  > p {
    margin: 0 0 10px;
  }
`;

export const PaymentAmount = styled.div`
  display: flex;
  justify-content: center;
`;
