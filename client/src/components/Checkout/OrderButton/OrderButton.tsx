import { useNavigate } from "react-router";
import Button from "../../../commons/Button/Button";

interface Props {
  itemCount: number;
  totalQuantity: number;
  totalAmount: number;
}

const OrderButton = ({ itemCount, totalQuantity, totalAmount }: Props) => {
  const navigate = useNavigate();

  const moveToCheckout = () => {
    navigate("/complete", {
      state: {
        itemCount,
        totalQuantity,
        totalAmount,
      },
    });
  };

  return <Button label="결제하기" onClick={moveToCheckout} />;
};

export default OrderButton;
