import { useState } from "react";
import { OrderData } from "../../type/types";
import { orderApi } from "../../api/orderApi";

interface Props {
  orderData: OrderData;
  onRemoteAreaChange: () => void;
}
export default function ShippingInfo({ orderData, onRemoteAreaChange }: Props) {
  const [isChecked, setIsChecked] = useState(orderData.remoteArea);
  const handleRemoteArea = async () => {
    const toggledRemoteArea = !isChecked;
    setIsChecked(toggledRemoteArea);
    await orderApi.patchAddress(orderData.orderId, toggledRemoteArea);
    onRemoteAreaChange();
  };

  return (
    <div>
      <p>배송 정보</p>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleRemoteArea}
        />
        제주도 및 도서 산간 지역
      </label>
    </div>
  );
}
