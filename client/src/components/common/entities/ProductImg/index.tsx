import styled from "@emotion/styled";
import { COLOR_PALETTE } from "@styles/colorPalette.ts";

export default function ProductImg(props: React.ComponentProps<"img">) {
  return <Img {...props} />;
}

const Img = styled.img`
  width: 7rem;
  aspect-ratio: 1/1;
  border-radius: 0.5rem;
  border: none;
  background-color: ${COLOR_PALETTE["image-placeholder"]};
  object-fit: cover;
`;
