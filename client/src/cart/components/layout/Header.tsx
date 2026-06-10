import styled from '@emotion/styled';
import {memo} from 'react';

import {Typo, theme} from '../../../design-system/index.js';

type HeaderProps = {
  title: string;
};

export const Header = memo(function Header({title}: HeaderProps) {
  return (
    <Container>
      <Typo as='span' color='white' variant='headline' weight='bold'>
        {title}
      </Typo>
    </Container>
  );
});

const Container = styled.header`
  display: flex;
  align-items: center;
  min-height: 64px;
  padding: 0 24px;
  background: ${theme.colors.black};
`;
