import styled from 'styled-components';

export const Title = styled.h1`
  margin: 0;

  color: #000000;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.2;
`;

export const Description = styled.p`
  margin: 0;

  color: #000000;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.4;
`;

export const Checkbox = styled.input`
  width: 22px;
  height: 22px;
  margin: 0;

  accent-color: #000000;
`;

export const Notice = styled.p`
  margin: 0;

  color: #000000;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.4;

  &::before {
    content: 'ⓘ';
    margin-right: 4px;
  }
`;
