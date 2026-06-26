import styled from '@emotion/styled';

import {theme} from '../foundation/theme.js';

interface DividerProps {
  className?: string;
}

export const Divider = ({className}: DividerProps) => {
  return <Line className={className} />;
};

const Line = styled.div`
  height: 1px;
  background: ${theme.colors.gray100};
`;
