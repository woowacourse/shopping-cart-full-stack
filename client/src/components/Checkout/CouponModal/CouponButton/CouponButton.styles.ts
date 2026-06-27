import styled from "@emotion/styled";

export const Container = styled.div`
  width: 100%;
`;

export const StyledButton = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 5px;
  border: 1px solid #33333340;
  color: #333333bf;
  background-color: transparent;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background-color: #f8f8f8;
  }

  &:focus-visible {
    outline: 2px solid #000000;
    outline-offset: 2px;
  }
`;
