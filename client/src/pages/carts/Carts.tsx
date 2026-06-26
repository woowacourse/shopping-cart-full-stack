import type { ChangeEvent } from "react";

import { useNavigate } from "react-router-dom";

import { Layout } from "@/core/components/Layout";
import { Header } from "@/core/components/Header";
import { Button } from "@/core/components/Button";
import { Checkbox } from "@/core/components/Checkbox";
import { List } from "@/core/components/List";
import { ImgBox } from "@/core/components/ImgBox";
import { Title } from "@/core/components/Title";
import { DataInfo } from "@/core/components/DataInfo";
import { NumberStepper } from "@/core/components/NumberStepper";
import { ContentBox } from "@/core/components/ContentBox";
import { Notice } from "@/core/components/Notice";
import { Loading } from "@/core/components/Loading";
import { Alert } from "@/core/components/Alert";

import { formatNumber } from "@/core/utils/format";

import { ROUTES } from "@/constants/routes";

import { useCartsActions } from "./useCartsActions";

import { calculateCartAmounts } from "./calculateCartAmounts";

import { FREE_DELIVERY_FEE_THRESHOLD } from "./constants";

export const Carts = () => {
  const {
    loadCartsProductsStatus,
    loadProductQuantityErrorMessage,
    cartProducts,
    updateProductQuantity,
    deleteProduct,
    updateProductSelection,
    updateAllProductSelection,

    submit,

    updateProductQuantityErrorMessage,
    openAlert,
    onAlertClose,
  } = useCartsActions();

  const isLoadingCartProducts = loadCartsProductsStatus === "loading";
  const shouldShowCartProducts = cartProducts.length !== 0;
  const shouldShowEmptyCartProducts =
    loadCartsProductsStatus === "success" && cartProducts.length === 0;

  const handleChangeQuantity = ({
    id,
    quantity,
  }: {
    id: number;
    quantity: number;
  }) => {
    updateProductQuantity({ id, quantity });
  };

  const handleClickDeleteProduct = ({ id }: { id: number }) => {
    deleteProduct({ id });
  };

  const isAllChecked = cartProducts.length
    ? cartProducts.every((product) => product.selected)
    : false;

  const handleAllToggleProductChecked = ({ checked }: { checked: boolean }) => {
    updateAllProductSelection({ selected: checked });
  };

  const handleToggleProductChecked = ({
    id,
    checked,
  }: {
    id: number;
    checked: boolean;
  }) => {
    updateProductSelection({ id, selected: checked });
  };

  const navigate = useNavigate();
  const handleClickOrderReview = async () => {
    const id = await submit();

    navigate(`${ROUTES.ORDER_REVIEW}/${id}`);
  };

  const filteredCartProducts = cartProducts.filter(
    (product) => product.selected,
  );

  const { cartAmount, deliveryFee, paymentAmount } =
    calculateCartAmounts(filteredCartProducts);

  return (
    <Layout>
      <Header title="SHOP" />
      <ContentBox>
        <Title
          title="장바구니"
          subTitle={`현재 ${cartProducts.length}종류의 상품이 담겨있습니다.`}
        />

        <Checkbox
          id="all"
          label="전체선택"
          checked={isAllChecked}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            handleAllToggleProductChecked({ checked: e.target.checked });
          }}
        />

        <hr />
        {isLoadingCartProducts && <Loading>loading...</Loading>}
        {shouldShowCartProducts && (
          <List>
            {cartProducts.map((product) => {
              return (
                <List.Item
                  key={product.id}
                  data-testid={`cart-product-${product.id}`}
                  header={{
                    left: (
                      <Checkbox
                        id={String(product.id)}
                        name={String(product.id)}
                        empty
                        checked={product.selected}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          handleToggleProductChecked({
                            id: product.id,
                            checked: e.target.checked,
                          });
                        }}
                      />
                    ),
                    right: (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          handleClickDeleteProduct({ id: product.id });
                        }}
                      >
                        삭제
                      </Button>
                    ),
                  }}
                >
                  <List.Item.Box
                    title={product.name}
                    content={`${formatNumber(product.price)}원`}
                    description={
                      <NumberStepper
                        min={1}
                        max={99}
                        value={product.quantity}
                        onDecrement={() => {
                          handleChangeQuantity({
                            id: product.id,
                            quantity: product.quantity - 1,
                          });
                        }}
                        onIncrement={() => {
                          handleChangeQuantity({
                            id: product.id,
                            quantity: product.quantity + 1,
                          });
                        }}
                      />
                    }
                  />
                  <List.Item.Left>
                    <ImgBox img={product.imgUrl || ""} />
                  </List.Item.Left>
                </List.Item>
              );
            })}
          </List>
        )}
        {loadProductQuantityErrorMessage && (
          <Notice>{loadProductQuantityErrorMessage}</Notice>
        )}
        {shouldShowEmptyCartProducts && (
          <Notice>장바구니에 담은 상품이 없습니다.</Notice>
        )}
        {!!cartProducts.length && (
          <>
            <p>
              총 주문 금액이 {FREE_DELIVERY_FEE_THRESHOLD}원 이상일 경우 무료
              배송됩니다.
            </p>

            <DataInfo>
              <DataInfo.Item
                title="주문금액"
                content={`${formatNumber(cartAmount)}원`}
              />
              <DataInfo.Item
                title="배송비"
                content={`${formatNumber(deliveryFee)}원`}
              />
              <DataInfo.Item
                title="총결제금액"
                content={`${formatNumber(paymentAmount)}원`}
              />
            </DataInfo>
          </>
        )}
      </ContentBox>
      <Button
        variant="primary"
        block
        size="large"
        disabled={!cartProducts.length || !filteredCartProducts.length}
        onClick={handleClickOrderReview}
      >
        주문 확인
      </Button>
      {openAlert && (
        <Alert onClose={onAlertClose}>
          {updateProductQuantityErrorMessage}
        </Alert>
      )}
    </Layout>
  );
};
