import Price from "../../commons/Price/Price";
import Between from "../layout/Between/Between";
import { Container, Text } from "./SummaryRow.styles";

interface Props {
  label: string;
  value: number;
}

const SummaryRow = ({ label, value }: Props) => {
  return (
    <Container>
      <Between>
        <Text>{label}</Text>
        <Price value={value} />
      </Between>
    </Container>
  );
};

export default SummaryRow;
