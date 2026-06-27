import type { ReactNode } from "react";
import styles from "./CheckBox.module.css";

interface CheckBoxProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export const CheckBox = ({ checked, onChange, disabled = false }: CheckBoxProps) => (
  <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
);

interface CheckListProps {
  allChecked: boolean;
  onToggleAll: () => void;
  label?: string;
  children: ReactNode;
}

interface CheckListItemProps {
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
  children: ReactNode;
}

export const CheckList = ({ allChecked, onToggleAll, label, children }: CheckListProps) => (
  <div>
    <div className={styles.checkboxRow}>
      <CheckBox checked={allChecked} onChange={onToggleAll} />
      {label && <label>{label}</label>}
    </div>
    <div className={styles.list}>{children}</div>
  </div>
);

export const CheckListItem = ({ checked, onToggle, onDelete, children }: CheckListItemProps) => (
  <div className={styles.listItem}>
    <div className={styles.itemHeader}>
      <div className={styles.itemCheckbox}>
        <CheckBox checked={checked} onChange={onToggle} />
      </div>
      <button className={styles.deleteButton} onClick={onDelete}>
        삭제
      </button>
    </div>
    {children}
  </div>
);
