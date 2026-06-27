import type { CartItem } from "../../../apis/cart.api.dto";
import ProductItemLayout from "../../../commons/ProductItemLayout/ProductItemLayout";
import {
  Container,
  Header,
  Divider,
  ItemList,
  QuantityText,
} from "./OrderItems.styles";

interface Props {
  orderItems: CartItem[];
}

const OrderItems = ({ orderItems }: Props) => {
  const itemCount = orderItems.length;
  const totalQuantity = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <Container>
      <Header>
        <p>
          총 {itemCount}종류의 상품 {totalQuantity}개를 주문합니다.
        </p>
        <p>최종 결제 금액을 확인해 주세요.</p>
      </Header>

      <Divider />

      <ItemList>
        {orderItems.map((item) => (
          <ProductItemLayout
            key={item.id}
            image={item.imageUrl}
            name={item.name}
            price={item.price}
            quantityContent={<QuantityText>{item.quantity}개</QuantityText>}
          />
        ))}
      </ItemList>
    </Container>
  );
};

export default OrderItems;
