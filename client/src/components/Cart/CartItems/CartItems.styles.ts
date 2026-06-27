import styled from "@emotion/styled";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
`;

export const SelectAll = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;

  label {
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
  }
`;

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0;
  border: 0;
  background: #e5e5e5;
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
`;
