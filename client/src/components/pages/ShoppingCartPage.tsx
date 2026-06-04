import styled from "styled-components";
import { useEffect, useState } from "react";

import type { CartItem } from "../../type/types";

import { shoppingCartApi } from "../../api/shoppingCartApi";
import ShoppingCartList from "../Cart/ShoppingCartList";
import CheckButton from "../button/CheckButton";
import ResultOrder from "./ResultOrder";
import ShopButton from "../button/ShopButton";

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

      const selectedInit = new Map<number, boolean>(
        data.map((item: CartItem): [number, boolean] => {
          return [item.cartItemId, true];
        }),
      );

      if (localStorage.getItem("storedCartItems")) {
        const storedCartItems = new Map<number, boolean>(
          JSON.parse(localStorage.getItem("storedCartItems")!),
        );
        setSelectedItems(storedCartItems);
      } else {
        setSelectedItems(selectedInit);
      }
    } catch (error) {
      throw new Error();
    }
  };

  const onToggle = (cartItemId: number) => {
    const newMap = new Map(selectedItems);
    newMap.set(cartItemId, !selectedItems.get(cartItemId));
    setSelectedItems(newMap);
    localStorage.setItem("storedCartItems", JSON.stringify([...newMap]));
  };

  const onTogleAll = () => {
    if ([...selectedItems.values()].every((value) => value === true)) {
      const newMap = new Map(selectedItems);
      newMap.forEach((_, key) => {
        newMap.set(key, false);
      });
      setSelectedItems(newMap);
      localStorage.setItem("storedCartItems", JSON.stringify([...newMap]));
    } else {
      const newMap = new Map(selectedItems);
      newMap.forEach((_, key) => {
        newMap.set(key, true);
      });
      setSelectedItems(newMap);
      localStorage.setItem("storedCartItems", JSON.stringify([...newMap]));
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

  const orderPrice = cartItems
    .filter((cartItem) => selectedItems.get(cartItem.cartItemId))
    .reduce(
      (acc, cartItem) => acc + cartItem.productData.price * cartItem.quantity,
      0,
    );
  const deliveryPrice = Number(orderPrice) >= 100000 ? 0 : 3000;
  const totalPrice = Number(orderPrice) + Number(deliveryPrice);

  const onQuantityChange = (cartItemId: number, newQuantity: number) => {
    const newCartItems = cartItems.map((item) => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  return (
    <Body>
      <Nav>
        <ShopButton />
      </Nav>
      <TopSection>
        <Title> 장바구니 </Title>
        <Label>현재 2종류의 상품이 담겨있습니다.</Label>
      </TopSection>
      <ShoppingCartList
        cartItems={cartItems}
        onDelete={onDelete}
        onTogle={onToggle}
        onTogleAll={onTogleAll}
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
  );
}

const Body = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 430px;
  height: 936px;
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
