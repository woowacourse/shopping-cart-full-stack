import Spinner from "../../../commons/Spinner/Spinner";
import { Container } from "./CartLoading.styles";

const CartLoading = () => {
  return (
    <Container role="status" aria-label="장바구니 조회 중">
      <Spinner />
    </Container>
  );
};

export default CartLoading;
