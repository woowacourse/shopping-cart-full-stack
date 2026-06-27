import styled from "@emotion/styled";

export const Container = styled.article`
  padding: 20px 0 28px;
  border-bottom: 1px solid #e5e5e5;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const DeleteButton = styled.button`
  min-width: 40px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #ffffff;
  color: #000000;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 18px;
  font-weight: 600;
`;

export const ControlButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #ffffff;
  color: #333333;
  font-size: 28px;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
`;
