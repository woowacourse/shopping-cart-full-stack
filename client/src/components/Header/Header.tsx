import { useLocation } from "react-router";
import backArrow from "../../assets/back-arrow.png";
import appLogo from "../../assets/app-logo.png";
import { Container, HomeButton } from "./Header.styles";
import { clearAllOrderStorage } from "../../storage/order.storage";
const getHeaderImage = (pathname: string) => {
  if (pathname === "/checkout") return backArrow;

  return appLogo;
};

const Header = () => {
  const { pathname } = useLocation();
  const isCheckout = pathname === "/checkout";

  return (
    <Container>
      <HomeButton
        to="/"
        isCheckout={isCheckout}
        onClick={() => clearAllOrderStorage()}
      >
        <img src={getHeaderImage(pathname)} alt="" />
      </HomeButton>
    </Container>
  );
};

export default Header;
