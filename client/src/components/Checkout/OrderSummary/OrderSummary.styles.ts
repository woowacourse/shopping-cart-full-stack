import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

export const SummaryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 16px;
    height: 16px;
  }

  p {
    margin: 0;
    color: #333333;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.6;
  }
`;

export const Divider = styled.hr`
  width: 100%;
  margin: 0;
  border: none;
  height: 1px;
  background: #0000001a;
`;
