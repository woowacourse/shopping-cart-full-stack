import styled from "@emotion/styled";

export const Button = styled.button`
  background-color: #000000;
  font-weight: 700;
  padding: 1.5rem 0;
  font-size: 16px;
  text-align: center;
  color: #ffffff;
  width: 100%;
  max-width: 768px;

  :disabled {
    background-color: #bebebe;
    border: none;
    cursor: default;
  }
`;

export const FixedButton = styled(Button)`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;
