import styled from "@emotion/styled";
import type { ReactNode } from "react";

type HeaderProps = {
  actionIcon: ReactNode;
};

const Header = ({ actionIcon }: HeaderProps) => {
  return <Container>{actionIcon}</Container>;
};

export default Header;

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  height: 64px;
  padding: 24px;
  background-color: black;
  font-weight: 800;
  font-size: 20px;
  color: white;
`;
