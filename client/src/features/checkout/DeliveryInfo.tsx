import { CheckBox } from "../../shared/CheckBox";
import styles from "./DeliveryInfo.module.css";

interface DeliveryInfoProps {
  checked: boolean;
  onToggle: () => void;
}

export const DeliveryInfo = ({ checked, onToggle }: DeliveryInfoProps) => (
  <div className={styles.delivery}>
    <h3 className={styles.deliveryTitle}>배송 정보</h3>
    <div className={styles.deliveryRow}>
      <CheckBox checked={checked} onChange={onToggle} />
      <span>제주도 및 도서 산간 지역</span>
    </div>
  </div>
);
