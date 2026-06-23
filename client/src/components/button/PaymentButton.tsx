import { useNavigate } from "react-router-dom";
import { orderApi } from "../../api/orderApi";
import styled from "styled-components";

interface Props {
  orderId: number;
}

export default function PaymentButton({ orderId }: Props) {
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const res = await orderApi.pay(orderId, {});
      if (!res.ok) throw new Error();
      const data = await res.json();
      navigate("/payment", { state: data });
    } catch {
      alert("서버 에러가 발생했습니다!");
    }
  };

  return <Button onClick={handlePayment}>결제하기</Button>;
}

const Button = styled.button`
  width: 100%;
  height: 64px;
  font-size: 16px;
  font-weight: 700;
  font-family: sans-serif;
  color: #ffffff;
  background-color: #000000;
  margin-top: auto;
  cursor: pointer;
`;
