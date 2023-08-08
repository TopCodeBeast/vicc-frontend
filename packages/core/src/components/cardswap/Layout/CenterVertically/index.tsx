import styled from 'styled-components';

export const CenterVertically = styled.div`
  display: grid;
  min-height: 100%;
  align-items: stretch;
  grid-template-rows: min-content auto;
  justify-content: center;
  grid-template-areas:
    'top'
    'content';
`;
