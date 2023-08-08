import styled from 'styled-components';

import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

const StickySectionTitle = styled.a`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: var(--c-neutral-100);
  top: 0;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: calc(-1 * var(--double-unit));
    height: var(--double-unit);
    background: linear-gradient(
      180deg,
      var(--c-neutral-100) 0%,
      var(--c-neutral-100) 20%,
      transparent 100%
    );
  }
  z-index: 1;
  @media ${tabletAndAbove} {
    width: 270px;
    min-height: 100px;
    top: 0;
    &:after {
      content: none;
    }
  }
  position: sticky;
  &,
  &:hover,
  &:focus {
    color: var(--c-neutral-1000);
  }
`;

export default StickySectionTitle;
