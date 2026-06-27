interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, disabled = false }: CheckboxProps) {
  return (
    <img
      src={checked ? `${import.meta.env.BASE_URL}check_filled.png` : `${import.meta.env.BASE_URL}check_empty.png`}
      alt={checked ? "선택됨" : "선택 안 됨"}
      style={{ cursor: disabled ? "not-allowed" : "pointer", width: "24px", height: "24px", opacity: disabled ? 0.4 : 1 }}
      onClick={() => { if (!disabled) onChange(!checked); }}
    />
  );
}
