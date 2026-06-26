import styled from "@emotion/styled";
import { COLOR_PALETTE } from "@styles/colorPalette";

interface HeaderProps {
  LeftComponent?: React.ReactElement;
  RightComponent?: React.ReactElement;
}

export default function Header({ LeftComponent, RightComponent }: HeaderProps) {
  return (
    <HeaderContainer>
      <ComponentContainer>{LeftComponent}</ComponentContainer>
      <ComponentContainer>{RightComponent}</ComponentContainer>
    </HeaderContainer>
  );
}
//TODO: layout 분리하기
const HeaderContainer = styled.header`
  width: 100%;
  height: 4rem;
  padding-inline: 1.5rem;
  background-color: ${COLOR_PALETTE.black};
  color: ${COLOR_PALETTE.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ComponentContainer = styled.div``;
