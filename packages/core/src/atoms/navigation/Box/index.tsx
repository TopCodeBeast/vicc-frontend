import styled from 'styled-components';

export const LinkBox = styled.div`
  position: relative;
  isolation: isolate;
`;

export const LinkOverlay = styled.a`
  position: static; /* If it's not static, the whole component doesn't work per design. */
  a&,
  button& {
    cursor: pointer;
  }
  &::before {
    position: absolute;
    z-index: 0;
    inset: 0;
    content: '';
  }
`;

export const LinkOther = styled.a`
  position: relative;
  z-index: 1;
  a&,
  button& {
    cursor: pointer;
  }
  &,
  &:hover,
  &:focus {
    color: inherit;
  }
`;
