import styled from "@emotion/styled";
import checked from "../../../assets/checked.svg";
import unchecked from "../../../assets/unchecked.svg";

interface Props {
  isRemoteArea: boolean;
  onToggle: (isRemoteArea: boolean) => void;
}

export default function ShippingOption({ isRemoteArea, onToggle }: Props) {
  return (
    <Section>
      <h4>배송 정보</h4>
      <Label>
        <input
          type="checkbox"
          checked={isRemoteArea}
          onChange={(e) => onToggle(e.target.checked)}
          aria-label="제주도 및 도서산간 지역"
        />
        <span>제주도 및 도서 산간 지역</span>
      </Label>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;

  h4 {
    margin: 0;
    font-family: "Noto Sans", sans-serif;
    font-weight: 700;
    font-size: 16px;
    line-height: 16px;
    color: rgba(10, 13, 19, 1);
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  cursor: pointer;

  input {
    appearance: none;
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    margin: 0;
    cursor: pointer;

    background-image: url("${unchecked}");
    background-size: 24px 24px;
    background-position: center;
    background-repeat: no-repeat;

    &:checked {
      background-image: url("${checked}");
    }
  }

  span {
    font-family: "Noto Sans", sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: rgba(10, 13, 19, 1);
  }
`;
