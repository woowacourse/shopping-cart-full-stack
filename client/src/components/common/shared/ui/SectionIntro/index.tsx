import styled from "@emotion/styled";

interface SectionIntroProps {
  title: string;
  description?: string[];
}

export default function SectionIntro({
  title,
  description,
}: SectionIntroProps) {
  return (
    <SectionIntroContainer>
      <Heading>{title}</Heading>
      {description &&
        description.map((desc, index) => (
          <Description key={index}>{desc}</Description>
        ))}
    </SectionIntroContainer>
  );
}

const SectionIntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Heading = styled.h2`
  font-weight: 700;
  font-size: 24px;
`;

const Description = styled.p`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
`;
