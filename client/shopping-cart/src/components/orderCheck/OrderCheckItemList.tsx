import { css } from '@emotion/react';
import type { OrderCheckProduct } from '../../types';
import ProductRaw from '../common/ProductRaw';

type Props = {
  products: OrderCheckProduct[];
};

const OrderCheckItemList = ({ products }: Props) => {
  return (
    <ul
      css={css`
        display: flex;
        flex-direction: column;
        gap: 12px;
        list-style: none;
        margin: 0;
        padding: 0;
      `}
    >
      {products.map((product) => (
        <li
          key={product.id}
          css={css`
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 12px 0px 20px;
            border-top: 1px solid var(--color-line);
          `}
        >
          <ProductRaw image={product.imgUrl} name={product.name} price={product.price}>
            <p>{product.quantity}개</p>
          </ProductRaw>
        </li>
      ))}
    </ul>
  );
};

export default OrderCheckItemList;
