import styled, { keyframes } from 'styled-components';

export const OrderSkeletonView = () => {
  return (
    <Section>
      <SectionHeader>
        <SkeletonText width="100px" height="32px" />
        <SkeletonText width="150px" height="20px" />
        <SkeletonText width="130px" height="20px" />
      </SectionHeader>

      <SectionContent>
        <Row>
          <SkeletonBox width="100px" height="100px" />
          <Col>
            <SkeletonText width="100px" height="20px" />
            <SkeletonText width="140px" height="20px" />
          </Col>
        </Row>

        <SkeletonText width="336px" height="40px" />

        <SkeletonText width="80px" height="20px" />
        <SkeletonText width="170px" height="20px" />
        <br />
        <Summary>
          <SkeletonText width="80px" height="20px" />
          <SkeletonText width="90px" height="20px" />
        </Summary>
        <Summary>
          <SkeletonText width="120px" height="20px" />
          <SkeletonText width="90px" height="20px" />
        </Summary>
        <Summary>
          <SkeletonText width="80px" height="20px" />
          <SkeletonText width="90px" height="20px" />
        </Summary>
        <br />
        <Summary>
          <SkeletonText width="120px" height="20px" />
          <SkeletonText width="90px" height="20px" />
        </Summary>
      </SectionContent>

      {/* <SectionFooter></SectionFooter> */}
    </Section>
  );
};

const pulse = keyframes`
  0%, 100% {
    opacity: 0.45;
  }

  50% {
    opacity: 1;
  }
`;

const SkeletonText = styled.span<{
  width: string;
  height: string;
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: 6px;

  background-color: #e8e8e8;
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

const SkeletonBox = styled.div<{
  width: string;
  height: string;
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: 6px;

  background-color: #e8e8e8;
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;

  gap: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;

const Summary = styled.div`
  display: flex;
  justify-content: space-between;
`;
