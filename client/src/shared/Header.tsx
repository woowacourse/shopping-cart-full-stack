import styles from "./Header.module.css";

interface HeaderProps {
  logo?: string;
  onClick?: () => void;
}

export const Header = ({ onClick, logo }: HeaderProps) => {
  return (
    <div className={styles.header}>
      <button type="button" className={styles.logo} onClick={onClick}>
        {logo}
      </button>
    </div>
  );
};
