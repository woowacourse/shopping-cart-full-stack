import { Container, Message } from "./CartEmpty.styles";

const CartEmpty = () => {
  return (
    <Container>
      <Message>장바구니에 담은 상품이 없습니다.</Message>
    </Container>
  );
};

export default CartEmpty;
