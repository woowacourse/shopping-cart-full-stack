import Spinner from "../../../commons/Spinner/Spinner";
import { Container } from "./CheckoutLoading.styles";

const CartUpdatingOverlay = () => {
  return (
    <Container role="status" aria-label="주문 확인 수정 중">
      <Spinner />
    </Container>
  );
};

export default CartUpdatingOverlay;
