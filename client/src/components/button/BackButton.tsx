import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      type="submit"
      onClick={() => {
        navigate(-1);
      }}
    >
      <img src="/backBtn.png" />
    </Button>
  );
}

const Button = styled.button`
  font-size: 20px;
  font-family: sans-serif;
  background-color: transparent;
  color: #ffffff;
  cursor: pointer;
  border: none;
  outline: none;
  margin-left: 24px;
  margin-top: 16px;
`;
