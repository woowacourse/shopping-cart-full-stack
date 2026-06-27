import type { CheckoutItem } from "../../entites/checkout/model";
import { CheckoutItemComponent } from "./CheckoutItem";
import styles from "./CheckoutSection.module.css";

interface CheckoutSectionProps {
  items: CheckoutItem[];
  onOpenCoupon: () => void;
}

export const CheckoutSection = ({ items, onOpenCoupon }: CheckoutSectionProps) => (
  <div className={styles.content}>
    <div className={styles.items}>
      {items.map((item) => (
        <CheckoutItemComponent key={item.id} {...item} />
      ))}
    </div>

    <button className={styles.couponButton} onClick={onOpenCoupon}>
      쿠폰 적용
    </button>
  </div>
);
