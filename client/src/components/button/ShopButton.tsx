import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function ShopButton() {
  const navigate = useNavigate();
  return (
    <Button type="submit" onClick={() => navigate("/")}>
      SHOP
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
  margin: 24px;
`;
