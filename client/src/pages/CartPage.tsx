import { useNavigate } from "react-router";
import type { CartItem } from "../entites/cart/model";
import { useCart } from "../features/cart-section/useCart";
import { CartEmptySection, CartSection } from "../features/cart-section/CartSection";
import { CartSummary } from "../features/cart-section/CartSummary";
import { CartSubmitButton } from "../features/cart-section/CartSubmitButton";
import { useCheckBox } from "../shared/useCheckBox";
import { ErrorInfo } from "../shared/ErrorInfo";
import { Header } from "../shared/Header";
import { Spinner } from "../shared/Spinner";
import { PageTitle } from "../shared/PageTitle";

export const CartPage = () => {
  const { state, isMutating, changeQuantity, handleDelete, serverError } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <Header logo="SHOP" onClick={() => navigate("/")} />
      {serverError && <p>에러 토스트:{serverError}</p>}
      {state.status === "loading" && <Spinner />}
      {state.status === "error" && <ErrorInfo message={state.error} />}
      {state.status === "success" && (
        <CartContent
          cart={state.cart}
          isMutating={isMutating}
          changeQuantity={changeQuantity}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

interface CartContentProps {
  cart: CartItem[];
  isMutating: boolean;
  changeQuantity: (productId: number, quantity: number) => void;
  handleDelete: (productId: number) => void;
}

const CartContent = ({ cart, isMutating, changeQuantity, handleDelete }: CartContentProps) => {
  const navigate = useNavigate();
  const itemIds = cart.map((item) => item.product.id);
  const { checks, toggleSelect, toggleAll } = useCheckBox(itemIds);
  const checkedItems = cart.filter((item) => checks.includes(item.product.id));

  const handleOrder = () => navigate("/checkout", { state: { checkedProductIds: checks } });

  if (cart.length === 0) {
    return <CartEmptySection />;
  }

  return (
    <>
      <PageTitle title="장바구니" subtitle={`현재 ${cart.length}종류의 상품이 담겨있습니다.`} />
      <CartSection
        cartItems={cart}
        checks={checks}
        isMutating={isMutating}
        toggleSelect={toggleSelect}
        toggleAll={toggleAll}
        changeQuantity={changeQuantity}
        handleDelete={handleDelete}
      />
      <CartSummary checkedItems={checkedItems} />
      <CartSubmitButton checkedItems={checkedItems} onSubmit={handleOrder} />
    </>
  );
};
