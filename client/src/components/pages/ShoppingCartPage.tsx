import styled from "styled-components";
import { useEffect, useState } from "react";

import type { CartItem } from "../../type/types";

import ShoppingCartList from "../Cart/ShoppingCartList";
import CheckButton from "../button/CheckButton";
import ResultOrder from "./ResultOrder";
import ShopButton from "../button/ShopButton";
import useCartItmes from "../../hooks/useCartItmes";
import useCartSelectBox from "../../hooks/useCartSelectBox";
import ShoppingCartSkeleton from "../skeleton/ShoppingCartSkeleton";

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Map<number, boolean>>(
    new Map(),
  );

  const { state, onDelete, onQuantityChange } = useCartItmes({
    setCartItems,
    setSelectedItems,
    cartItems,
  });

  const { onToggle, onToggleAll } = useCartSelectBox({
    selectedItems,
    setSelectedItems,
  });

  const orderPrice = cartItems
    .filter((cartItem) => selectedItems.get(cartItem.cartItemId))
    .reduce(
      (acc, cartItem) => acc + cartItem.productData.price * cartItem.quantity,
      0,
    );
  const deliveryPrice = Number(orderPrice) >= 100000 ? 0 : 3000;
  const totalPrice = Number(orderPrice) + Number(deliveryPrice);

  return (
    <MainContainer>
      {state.status === "loading" ? (
        <ShoppingCartSkeleton />
      ) : (
        <Body>
          <Nav>
            <ShopButton />
          </Nav>
          <TopSection>
            <Title> 장바구니 </Title>
            <Label>현재 {cartItems.length} 종류의 상품이 담겨있습니다.</Label>
          </TopSection>
          <ShoppingCartList
            cartItems={cartItems}
            onDelete={onDelete}
            onTogle={onToggle}
            onToggleAll={onToggleAll}
            selectedItems={selectedItems}
            onQuantityChange={onQuantityChange}
          />
          <ResultOrder
            orderPrice={orderPrice}
            deliveryPrice={deliveryPrice}
            totalPrice={totalPrice}
          />
          <CheckButton
            cartItems={cartItems}
            selectedItems={selectedItems}
            totalPrice={totalPrice}
          />
        </Body>
      )}
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 430px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  background-color: #000000;
`;

const TopSection = styled.div`
  width: 382px;
  height: 62px;
  margin: 24px 36px;
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
