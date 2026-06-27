import { useNavigate } from "react-router";
import Button from "../../commons/Button/Button";
import { clearOrderStorage } from "../../storage/order.storage";

const BackToCartButton = () => {
  const navigate = useNavigate();

  const handleBackToCart = () => {
    clearOrderStorage();
    navigate("/");
  };

  return <Button label="장바구니로 돌아가기" onClick={handleBackToCart} />;
};

export default BackToCartButton;
