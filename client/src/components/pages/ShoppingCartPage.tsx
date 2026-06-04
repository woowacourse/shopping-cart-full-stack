import styled from "styled-components";
import HeaderButton from "../button/HeaderButton";
import { useEffect, useState } from "react";
import type { CartItem } from "../../type/types";
import { shoppingCartApi } from "../../api/shoppingCartApi";
import ShoppingCartList from "../Cart/ShoppingCartList";
import CheckButton from "../button/CheckButton";
import ResultOrder from "./ResultOrder";

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Map<number, boolean>>(
    new Map(),
  );

  const fetchCartItems = async () => {
    try {
      const res = await shoppingCartApi.get();
      if (!res.ok) throw new Error("서버 에러");
      const data = await res.json();
      setCartItems(data);
      const selectedInit = new Map();
      setSelectedItems(selectedInit);
    } catch (error) {
      throw new Error();
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const onDelete = async (cartItemId: number) => {
    try {
      const res = await shoppingCartApi.delete(cartItemId);
      if (!res.ok) throw new Error();
      fetchCartItems();
    } catch {
      alert("상품 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <Body>
      <Nav>
        <HeaderButton />
      </Nav>
      <Title> 장바구니 </Title>
      <Label>현재 2종류의 상품이 담겨있습니다.</Label>
      <ShoppingCartList cartItems={cartItems} onDelete={onDelete} />
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
