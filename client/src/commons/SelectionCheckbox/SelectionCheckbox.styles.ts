import styled from "@emotion/styled";

export const Container = styled.button<{ isChecked: boolean }>`
  background: ${({ isChecked }) => (isChecked ? "#000000" : "#ffffff")};
  border: 1px solid ${({ isChecked }) => (isChecked ? "#000000" : "#d9d9d9")};
  border-radius: 8px;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  > img {
    width: 18px;
    height: 14px;
    opacity: ${({ isChecked }) => (isChecked ? 1 : 0)};
  }
`;
