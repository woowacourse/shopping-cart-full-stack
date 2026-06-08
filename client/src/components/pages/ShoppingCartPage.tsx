import styled from "styled-components";

import ShoppingCartList from "../Cart/ShoppingCartList";
import CheckButton from "../button/CheckButton";
import ResultOrder from "./ResultOrder";
import ShopButton from "../button/ShopButton";
import useCartItmes from "../../hooks/useCartItmes";
import useCartSelectBox from "../../hooks/useCartSelectBox";
import ShoppingCartSkeleton from "../skeleton/ShoppingCartSkeleton";
import { getOrderPrice } from "../../util/getOrderPrice";

export default function ShoppingCartPage() {
  const { state, cartItems, onDelete, onQuantityChange } = useCartItmes();

  const { selectedItems, onToggle, onToggleAll } = useCartSelectBox({
    cartItems,
  });

  const { orderPrice, deliveryPrice, totalPrice } = getOrderPrice({
    cartItems,
    selectedItems,
  });

  return (
    <MainContainer>
      {state.status === "loading" && <ShoppingCartSkeleton />}
      {state.status === "error" && (
        <ErrorMessage>장바구니를 불러오는 데 실패했습니다.</ErrorMessage>
      )}
      {state.status === "success" && (
        <Body>
          <Nav>
            <ShopButton />
          </Nav>
          <SubContainer>
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
          </SubContainer>
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
  height: 100vh;
  overflow: hidden;
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 430px;
  height: 100vh;
  overflow: hidden;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  background-color: #000000;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  overflow: hidden;
  flex: 1;
  padding: 24px;
  box-sizing: border-box;
`;

const TopSection = styled.div`
  width: 100%;
  height: 62px;
  margin-bottom: 24px;
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

const ErrorMessage = styled.p`
  margin-top: 40px;
  font-size: 14px;
  color: #888;
`;
