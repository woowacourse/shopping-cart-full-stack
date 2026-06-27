import Cart from "../../components/Cart/Cart";
import CartEmpty from "../../components/Cart/CartEmpty/CartEmpty";
import CartError from "../../components/Cart/CartError/CartError";
import { Container, Title } from "./CartPage.styles";
import useCartData from "../../hooks/useCartData";
import UpdatingOverlay from "../../commons/UpdatingOverlay/UpdatingOverlay";
import Toast from "../../commons/Toast/Toast";
import CartLoading from "../../components/Cart/CartLoading/CartLoading";

const CartPage = () => {
  const {
    data,
    loading,
    error,
    mutationError,
    mutationLoading,
    updateQuantity,
    deleteItem,
  } = useCartData();

  let content = (
    <Cart
      cartItemsList={data}
      updateQuantity={updateQuantity}
      deleteItem={deleteItem}
    />
  );

  if (loading) content = <CartLoading />;
  else if (error) content = <CartError error={error.message} />;
  else if (data.length === 0) content = <CartEmpty />;

  return (
    <Container>
      <Title>장바구니</Title>
      {content}
      {mutationLoading && <UpdatingOverlay ariaLabel="장바구니 수정 중" />}
      {mutationError && <Toast message={mutationError.message} />}
    </Container>
  );
};

export default CartPage;
