import type { Product } from '../api/apiTypes';
import ItemCardLayout from './ItemCardLayout';
import ItemCardStyle from './ItemCardStyle';
import QuantitySlot from './QuantitySlot';

interface OrderItemCardProps {
    product: Product;
    quantity: number;
}

export default function OrderItemCard({ product, quantity }: OrderItemCardProps) {
    return (
        <ItemCardStyle>
            <ItemCardLayout product={product} quantityArea={<QuantitySlot>수량 {quantity}개</QuantitySlot>} />
        </ItemCardStyle>
    );
}
