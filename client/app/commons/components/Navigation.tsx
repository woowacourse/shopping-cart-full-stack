import styled from "@emotion/styled";
import { ReactNode } from "react";

export default function Navigation({ children }: { children?: ReactNode }) {
  return <Nav>{children}</Nav>;
}

const Nav = styled.nav`
  padding: 1.5rem;
  background-color: #000000;
`;
