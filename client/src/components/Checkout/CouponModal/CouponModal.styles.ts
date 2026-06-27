import styled from "@emotion/styled";

export const ModalContainer = styled.div`
  width: 100%;
  height: 600px;
  margin: 0 24px;
  padding: 24px 32px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
`;

export const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgb(0 0 0 / 50%);
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 32px;

  p {
    font-size: 18px;
    font-weight: 700;
  }

  button {
    width: 24px;
    height: 24px;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    background: white;
  }
`;
