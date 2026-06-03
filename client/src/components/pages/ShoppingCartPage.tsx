import styled from "styled-components";
import HeaderButton from "../button/HeaderButton";

export default function ShoppingCartPage() {
  return (
    <Body>
      <Nav>
        <HeaderButton />
      </Nav>
      <Title> 장바구니 </Title>
      <Label>현재 2종류의 상품이 담겨있습니다.</Label>
      <ShoppingCartList />
      <ResultOrder />
      <CheckButton />
    </Body>
  );
}

const Body = styled.div`
  width: 430px;
  height: 936px;
`;

const Nav = styled.nav`
  width: 100%;
  height: 64px;
  background-color: #000000;
`;

const Title = styled.div`
  font-size: 24px;
  font-family: sans-serif;
  font-weight: 700;
`;

const Label = styled.div`
  font-size: 12px;
  font-family: sans-serif;
  font-weight: 500;
`;
