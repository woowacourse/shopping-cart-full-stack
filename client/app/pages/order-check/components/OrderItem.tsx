import styled from "@emotion/styled";
import { CartItem } from "../../shopping-cart/types";
import { formatToKoreanPrice } from "../../../commons/utils";

export default function OrderItem({ item }: { item: CartItem }) {
  const { quantity, product } = item;
  return (
    <OrderItemLayout>
      <div className="wrapper">
        <Content>
          <img
            className="thumbnail"
            src={`${import.meta.env.VITE_API_BASE_URL}${product.thumbnail}`}
            alt={`${product.name} 상품 이미지`}
          />
          <Info>
            <p className="name">{product.name}</p>
            <p className="price">{formatToKoreanPrice(product.price)}</p>
            <p className="quantity">{quantity} 개</p>
          </Info>
        </Content>
      </div>
    </OrderItemLayout>
  );
}

const OrderItemLayout = styled.li`
  list-style: none;
  display: flex;
  gap: 1rem;
  width: 100%;
  padding: 8px 0;
  border-top: 1px solid #0000001a;

  .wrapper {
    width: 100%;
  }
`;

const Content = styled.div`
  display: flex;
  gap: 1.5rem;

  img.thumbnail {
    height: 112px;
    width: 112px;
    border-radius: 8px;
  }
`;

const Info = styled.div`
  padding: 4px 0;
  .name {
    font-weight: 500;
    font-size: 12px;
    margin: 4px 0;
  }

  .price {
    font-weight: 700;
    font-style: Bold;
    font-size: 24px;
    margin-top: 0;
  }

  .quantity {
    font-weight: 500;
    font-size: 12px;
  }
`;
