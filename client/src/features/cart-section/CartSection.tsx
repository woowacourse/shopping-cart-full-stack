import type { CartItem } from "../../entites/cart/model";
import { CheckList, CheckListItem } from "../../shared/CheckBox";
import { CartItemComponent } from "./CartItem";
import styles from "./CartSection.module.css";

export interface CartSectionType {
  cartItems: CartItem[];
  checks: number[];
  isMutating: boolean;
  toggleSelect: (id: number) => void;
  toggleAll: () => void;
  changeQuantity: (id: number, quantity: number) => void;
  handleDelete: (id: number) => void;
}

export const CartSection = ({
  cartItems,
  checks,
  isMutating,
  toggleSelect,
  toggleAll,
  changeQuantity,
  handleDelete,
}: CartSectionType) => {
  const totalCount = cartItems.length;
  const isAllChecked = totalCount > 0 && checks.length === totalCount;

  return (
    <div className={styles.content}>
      <span className={styles.checkCount}>
        ({checks.length}/{totalCount})
      </span>
      <hr className={styles.divider} />
      <CheckList allChecked={isAllChecked} onToggleAll={toggleAll} label="전체선택">
        {cartItems.map((cartItem) => {
          const id = cartItem.product.id;
          return (
            <CheckListItem
              key={id}
              checked={checks.includes(id)}
              onToggle={() => toggleSelect(id)}
              onDelete={() => handleDelete(id)}
            >
              <CartItemComponent
                cartItem={cartItem}
                isMutating={isMutating}
                onQuantityChange={changeQuantity}
              />
            </CheckListItem>
          );
        })}
      </CheckList>
    </div>
  );
};

export const CartEmptySection = () => {
  return (
    <div className={styles.notice}>
      <p>장바구니에 담긴 상품이 없습니다.</p>
    </div>
  );
};
