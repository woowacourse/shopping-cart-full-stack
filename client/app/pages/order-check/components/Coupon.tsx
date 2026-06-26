import styled from "@emotion/styled";
import Checkbox from "../../../commons/components/Checkbox";
import { Coupon as CouponType } from "../types";

interface Props {
  item: CouponType;
  isSelect: boolean;
  onToggle: () => void;
}

export default function Coupon({ item, isSelect, onToggle }: Props) {
  return (
    <CouponItem key={item.id} isActive={item.is_active}>
      <CouponLayout>
        <CouponHeader>
          <Checkbox
            labelText={item.name}
            onChange={onToggle}
            checked={isSelect}
          ></Checkbox>
        </CouponHeader>
        <div>
          <SubText>만료일: {item.expiration_date}</SubText>
          <SubText>{item.description}</SubText>
        </div>
      </CouponLayout>
    </CouponItem>
  );
}

const CouponLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

const CouponHeader = styled.div`
  margin: 8px 0;
`;

const SubText = styled.p`
  font-weight: 500;
  font-size: 12px;
  margin: 4px 0;
`;

const CouponItem = styled.li<{ isActive: boolean }>`
  list-style: none;
  display: flex;
  gap: 12px;
  width: 100%;
  width: 318px;
  height: 82px;
  border-top: 1px solid #0000001a;
  opacity: ${(props) => (props.isActive ? 1 : 0.3)};
`;
