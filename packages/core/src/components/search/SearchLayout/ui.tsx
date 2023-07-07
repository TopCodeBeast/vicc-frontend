import styled from 'styled-components';

import { desktopAndAbove } from '@core/style/mediaQuery';

export const SearchLayoutContainer = styled.div`
  display: flex;
  & > * {
    max-width: 100%;
  }
`;

export const SearchLayoutMain = styled.div`
  flex: 1;
  gap: var(--double-unit);
  display: flex;
  flex-direction: column;
`;

export const LeftFilters = styled.div<{ visible: boolean }>`
  background: var(--c-neutral-100);
  border-radius: 8px;
  overflow: hidden;
  height: max-content;
  flex: none;
  width: 0px;
  opacity: 0;
  margin-right: 0px;
  transition: all 0.2s ease-in-out 0.2s, opacity 0.2s linear;
  ${({ visible }) =>
    visible
      ? `
      opacity: 1;
      width: 260px;
      margin-right: var(--quadruple-unit);
      transition: all 0.2s ease-in-out, opacity 0.2s linear 0.2s;
      @media ${desktopAndAbove} {
        width: 300px;
      }
    `
      : ''}
  display: block;
  &:not(:has(.FilterWidget.visible)) {
    display: none;
  }
`;
