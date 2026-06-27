import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  border-radius: 24px;
`;

export const Title = styled.p`
  margin: 0;
  color: #0a0d13;
  font-size: 16px;
  font-weight: 700;
`;

export const RowContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Label = styled.p`
  margin: 0;
  color: #0a0d13;
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
`;
