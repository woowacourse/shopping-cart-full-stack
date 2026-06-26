import Header from "../../shared/components/Header";
import CartPageBody from "./components/CartPageBody/CartPageBody";
import 임시추가버튼 from "./components/임시추가버튼";
import styled from "@emotion/styled";
import { typography } from "../../shared/styles/typography";

const CartPage = () => {
  return (
    <CartPageLayout>
      <Header actionIcon={<div>SHOP</div>} />
      <CartPageBodyArea>
        <CartContentTitle>
          장바구니 <임시추가버튼 />
        </CartContentTitle>
        <CartPageBody />
      </CartPageBodyArea>
    </CartPageLayout>
  );
};

export default CartPage;

const CartPageLayout = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 64px 0;
`;

const CartPageBodyArea = styled.div`
  padding: 24px;
`;

const CartContentTitle = styled.div`
  ${typography.titleLarge}
  margin-bottom: 12px;
`;
