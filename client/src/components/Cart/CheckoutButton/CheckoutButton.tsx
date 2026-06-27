import { useNavigate } from "react-router";
import Button from "../../../commons/Button/Button";

interface Props {
  itemCount: number;
}

const CheckoutButton = ({ itemCount }: Props) => {
  const navigate = useNavigate();

  return (
    <Button
      label="주문 확인"
      onClick={() => navigate("/checkout")}
      disabled={itemCount === 0}
    />
  );
};

export default CheckoutButton;
