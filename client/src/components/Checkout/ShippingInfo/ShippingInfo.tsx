import SelectionCheckbox from "../../../commons/SelectionCheckbox/SelectionCheckbox";
import { Container, Title, RowContent, Label } from "./ShippingInfo.styles";
import { useRemoteAreaSelection } from "../../../hooks/useRemoteArea";

interface Props {
  refetch: () => void;
}

const ShippingInfo = ({ refetch }: Props) => {
  const { isRemoteArea, toggleRemoteArea } = useRemoteAreaSelection();

  const handleToggleChecked = () => {
    toggleRemoteArea();
    refetch();
  };

  return (
    <Container>
      <Title>배송 정보</Title>
      <RowContent>
        <SelectionCheckbox
          isChecked={isRemoteArea}
          onClick={handleToggleChecked}
        />
        <Label>제주도 및 도서 산간 지역</Label>
      </RowContent>
    </Container>
  );
};

export default ShippingInfo;
