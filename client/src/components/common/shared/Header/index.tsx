import Flex from "@components/common/shared/Flex";
import styled from "@emotion/styled";
import { COLOR_PALETTE } from "@styles/colorPalette";

interface HeaderProps {
  LeftComponent?: React.ReactElement;
  RightComponent?: React.ReactElement;
}

export default function Header({ LeftComponent, RightComponent }: HeaderProps) {
  return (
    <HeaderContainer align="center" justify="space-between">
      <ComponentContainer>{LeftComponent}</ComponentContainer>
      <ComponentContainer>{RightComponent}</ComponentContainer>
    </HeaderContainer>
  );
}

const HeaderContainer = styled(Flex.withComponent('header'))`
  width: 100%;
  height: 4rem;
  padding-inline: 1.5rem;
  background-color: ${COLOR_PALETTE.black};
  color: ${COLOR_PALETTE.white};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ComponentContainer = styled.div``;
