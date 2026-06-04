interface Props {
  orderPrice: number;
  deliveryPrice: number;
  totalPrice: number;
}

export default function ResultOrder({
  orderPrice,
  deliveryPrice,
  totalPrice,
}: Props) {
  return (
    <table>
      <th>
        <img src="/!_img.jpg" alt="느낌표" />
        <p>총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.</p>
      </th>
      <tr>
        <td>주문 금액</td>
        <td>{orderPrice}</td>
      </tr>
      <tr>
        <td>배송비</td>
        <td>{deliveryPrice}</td>
      </tr>
      <tr>
        <td>총 결제 금액</td>
        <td>{totalPrice}</td>
      </tr>
    </table>
  );
}
