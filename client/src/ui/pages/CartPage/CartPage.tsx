import { useNavigate } from "react-router-dom";
import { CartItem } from "../../components/CartItem/CartItem";
import { CartSummary } from "../../components/CartSummary/CartSummary";
import { useCartService } from "../../../service/useCartService";
import { useCartItemSelection } from "../../../service/useCartItemSelection";
import { fetchCartApi } from "../../../infrastructure/api/fetchCartApi";
import {
  BottomSection,
  CartListContainer,
  CheckboxLabel,
  ContainerWrapper,
  EmptyStateWrapper,
  MainContent,
  OrderButton,
  PageContainer,
  PageTitle,
  SelectAllRow,
  SubTitle,
  TitleSection,
} from "./CartPage.styles";
import { Header } from "../../components/Header/Header";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import { fetchPreorderApi } from "../../../infrastructure/api/fetchPreorderApi";

type PageStatus = "loading" | "success" | "error";

export const CartPage = () => {
  const navigate = useNavigate();

  const { cartItems, isLoading, error, changeQuantity, removeCartItem } =
    useCartService(fetchCartApi);

  const {
    selectedIds,
    toggleSelection,
    toggleAll,
    deselectItem,
    isAllSelected,
    totalProductPrice,
    deliveryPrice,
    totalPrice,
  } = useCartItemSelection(cartItems);

  const currentStatus: PageStatus = isLoading
    ? "loading"
    : error
      ? "error"
      : "success";

  const isEmpty = cartItems.length === 0;

  const handleOrderConfirm = async () => {
    try {
      const { preorderId } = await fetchPreorderApi.createPreorder(selectedIds);

      navigate("/preorder", {
        state: { preorderId },
      });
    } catch {
      alert(
        "주문서를 생성하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      );
    }
  };

  const handleRemoveItem = async (id: number) => {
    await removeCartItem(id);
    deselectItem(id);
  };

  return (
    <PageContainer>
      <ContainerWrapper>
        <Header onLogoClick={() => navigate("/")} />

        <MainContent>
          <TitleSection>
            <PageTitle>장바구니</PageTitle>
            {currentStatus === "success" && !isEmpty && (
              <SubTitle>
                현재 {cartItems.length}종류의 상품이 담겨있습니다.
              </SubTitle>
            )}
          </TitleSection>

          {currentStatus === "loading" && (
            <EmptyStateWrapper>장바구니가 로딩중입니다..</EmptyStateWrapper>
          )}

          {currentStatus === "error" && (
            <EmptyStateWrapper>{error}</EmptyStateWrapper>
          )}

          {currentStatus === "success" && isEmpty && (
            <EmptyStateWrapper>
              장바구니에 담은 상품이 없습니다.
            </EmptyStateWrapper>
          )}

          {currentStatus === "success" && !isEmpty && (
            <>
              <SelectAllRow>
                <Checkbox checked={isAllSelected} onChange={toggleAll} />
                <CheckboxLabel>전체 선택</CheckboxLabel>
              </SelectAllRow>

              <CartListContainer>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.cartItemId}
                    item={item}
                    isSelected={selectedIds.includes(item.cartItemId)}
                    onSelectionChange={toggleSelection}
                    onQuantityChange={changeQuantity}
                    onDelete={handleRemoveItem}
                  />
                ))}
              </CartListContainer>

              <CartSummary
                totalProductPrice={totalProductPrice}
                deliveryPrice={deliveryPrice}
                totalPrice={totalPrice}
              />
            </>
          )}
        </MainContent>

        <BottomSection>
          <OrderButton
            onClick={handleOrderConfirm}
            disabled={isEmpty || selectedIds.length === 0}
          >
            주문 확인
          </OrderButton>
        </BottomSection>
      </ContainerWrapper>
    </PageContainer>
  );
};
