import styled from "@emotion/styled";
import Navigation from "../../commons/components/Navigation";
import Section from "./Section";

export default function PurchaseCheckPage() {
  return (
    <PurchaseCheckPageContainer>
      <Navigation></Navigation>
      <Section />
    </PurchaseCheckPageContainer>
  );
}

const PurchaseCheckPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;
