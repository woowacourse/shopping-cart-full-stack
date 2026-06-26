import useOrderQuery from "@hooks/feature/query/useOrderQuery";
import OrderProductItem from "@components/common/shared/ui/OrderProductItem";
import styled from "@emotion/styled";

function OrderConfirmProductList() {
  const { data } = useOrderQuery();

  const orderProducts = data.orderProducts;

  return (
    <OrderListContainer>
      <CartListWrapper>
        {orderProducts.map(
          ({ imgUrl, productId, productName, productPrice, quantity }) => (
            <OrderProductItem
              key={productId}
              name={productName}
              image={imgUrl}
              price={productPrice}
              quantity={quantity}
            />
          ),
        )}
      </CartListWrapper>
    </OrderListContainer>
  );
}

const OrderListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CartListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export default OrderConfirmProductList;
