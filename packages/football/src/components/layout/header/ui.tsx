import styled from 'styled-components';

import {
  mobileAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

export const Root = styled.div`
  color: var(--c-static-neutral-100);
  background: linear-gradient(
      180deg,
      rgba(var(--c-static-rgb-neutral-1000), 0.8) 0%,
      var(--c-static-neutral-1000) 100%
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
  @media ${tabletAndAbove} {
    flex-direction: row;
    text-align: left;
  }
`;
export const Informations = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media ${tabletAndAbove} {
    justify-content: flex-start;
  }
`;
export const Logo = styled.img`
  height: 60px;
  @media ${mobileAndAbove} {
    height: 80px;
  }
  @media ${tabletAndAbove} {
    height: 120px;
  }
`;
