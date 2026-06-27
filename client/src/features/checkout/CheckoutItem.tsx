import { type CartItem } from "../../entites/checkout/model";
import styles from "./CheckoutItem.module.css";

export interface CheckoutItemProps extends CartItem {
  giftQuantity?: number;
}

export const CheckoutItemComponent = (props: CheckoutItemProps) => {
  const { product, quantity, giftQuantity = 0 } = props;
  const { price, name, thumbnail } = product;

  return (
    <div className={styles.body}>
      <div className={styles.imgBox}>
        <img src={thumbnail} alt={name} />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.price}>{price.toLocaleString()}원</div>
        <div>
          {quantity}개
          {giftQuantity > 0 && <span className={styles.giftText}>+{giftQuantity}(쿠폰적용)</span>}
        </div>
      </div>
    </div>
  );
};
