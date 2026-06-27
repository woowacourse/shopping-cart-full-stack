import type { ReactNode } from "react";
import Price from "../../commons/Price/Price";
import {
  Container,
  Image,
  Info,
  Title,
  Quantity,
} from "./ProductItemLayout.styles";

interface Props {
  image: string;
  name: string;
  price: number;
  quantityContent: ReactNode;
}

const ProductItemLayout = ({ image, name, price, quantityContent }: Props) => {
  return (
    <Container>
      <Image src={image} alt={name} />
      <Info>
        <Title>{name}</Title>
        <Price value={price} />
        <Quantity>{quantityContent}</Quantity>
      </Info>
    </Container>
  );
};

export default ProductItemLayout;
