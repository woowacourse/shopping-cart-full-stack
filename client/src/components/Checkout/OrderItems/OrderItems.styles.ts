import styled from "@emotion/styled";

export const Container = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;

  p {
    color: #0a0d13;
    font-size: 12px;
  }
`;

export const Divider = styled.hr`
  width: 100%;
  margin: 0;
  border: none;
  height: 1px;
  background: #0000001a;
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const QuantityText = styled.p`
  margin: 0;
  color: #0a0d13;
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
`;
