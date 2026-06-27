import type { OrderResponse } from '../../../api/orderDraft/orderApi.types';
import { ItemLayout } from '../../../shared/components/ItemLayout';

type OrderItemProps = OrderResponse['products'][number];

export const OrderItem = ({ product }: { product: OrderItemProps }) => {
  return (
    <ItemLayout
      image={
        <ItemLayout.Image src={product.imageUrl} alt={product.productName} />
      }
      name={<ItemLayout.Name>{product.productName}</ItemLayout.Name>}
      price={
        <ItemLayout.Price>
          {product.productPrice.toLocaleString()}원
        </ItemLayout.Price>
      }
      quantitySlot={
        <ItemLayout.Quantity>{product.quantity}개</ItemLayout.Quantity>
      }
    />
  );
};
