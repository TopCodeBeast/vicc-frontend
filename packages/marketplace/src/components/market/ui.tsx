import styled from 'styled-components';

export const MarketRoot = styled.div<{ noMargin?: boolean }>`
  background-color: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  padding: ${({ noMargin }) =>
    noMargin ? '0 0 var(--triple-unit)' : 'var(--triple-unit) 0'};
`;
