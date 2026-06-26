import styled from '@emotion/styled';
import type {ReactNode} from 'react';

import {Typo} from '../../design-system/index.js';

interface PageIntroProps {
  title: ReactNode;
  description?: ReactNode;
}

export const PageIntro = ({title, description}: PageIntroProps) => {
  return (
    <Container>
      <Typo as='h1' variant='display' weight='bold'>
        {title}
      </Typo>
      {description && (
        <Typo as='p' color='gray900' variant='caption' weight='medium'>
          {description}
        </Typo>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
