import styled from 'styled-components';

import { theme } from '@sorare/core/src/style/theme';

export const Root = styled.div`
  color: var(--c-neutral-1000);
  background: linear-gradient(
      180deg,
      rgba(var(--c-rgb-neutral-100), 0.8) 0%,
      var(--c-neutral-100) 100%
    ),
    var(--c-gradient-rare);
`;
export const InnerContainer = styled.div`
  padding: var(--double-unit) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--double-unit);
  text-align: center;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: row;
    text-align: left;
  }
`;
export const Informations = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    justify-content: flex-start;
  }
`;
export const Logo = styled.img`
  height: 60px;
  @media (min-width: ${theme.breakpoints.values.mobile}px) {
    height: 80px;
  }
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    height: 120px;
  }
`;
