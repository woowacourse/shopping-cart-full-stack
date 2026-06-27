import UpdatingOverlay from "../../commons/UpdatingOverlay/UpdatingOverlay";
import CartError from "../../components/Cart/CartError/CartError";
import CartLoading from "../../components/Cart/CartLoading/CartLoading";
import Checkout from "../../components/Checkout/Checkout";
import useOrderItems from "../../hooks/useOrderItems";
import { Container, Title } from "./CheckoutPage.styles";

const CheckoutPage = () => {
  const { data, loading, error, refetch } = useOrderItems();

  let content = <CartLoading />;
  if (error) content = <CartError error={error.message} />;
  if (data !== null) content = <Checkout data={data} refetch={refetch} />;

  return (
    <Container>
      <Title>주문 확인</Title>
      {content}
      {loading && data !== null && (
        <UpdatingOverlay ariaLabel="주문 확인 수정 중" />
      )}
    </Container>
  );
};

export default CheckoutPage;
