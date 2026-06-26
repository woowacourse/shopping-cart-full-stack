import styled from "@emotion/styled";
import { CartItem } from "../../shopping-cart/types";
import OrderItem from "./OrderItem";

export default function OrderItemList({ items }: { items: CartItem[] }) {
  return (
    <ItemListLayout>
      {items.map((item: CartItem) => {
        return <OrderItem item={item}></OrderItem>;
      })}
    </ItemListLayout>
  );
}

const ItemListLayout = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
  width: 100%;
`;
