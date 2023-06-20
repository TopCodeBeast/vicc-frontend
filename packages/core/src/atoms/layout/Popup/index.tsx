import { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

import { theme } from '@sorare/core/src/style/theme';

type Props = { children: ReactNode; className?: string };

const enter = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const desktopEnter = keyframes`
  from {
    transform: translateX(-400px);
  }

  to {
    transform: translateX(0px);
  }
`;

const Root = styled.div`
  isolation: isolate;
  animation: ${enter} 0.25s ease-out;
  animation-fill-mode: both;
  background: var(--c-neutral-100);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${theme.zIndex.modal + 1};
  max-height: 100%;
  overflow: auto;
  box-shadow: 0px 5px 20px 5px rgba(0, 0, 0, 0.4);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    right: auto;
    width: 400px;
    border-radius: 8px;
    margin: 20px;
    animation: ${desktopEnter} 0.25s ease-out;
  }
`;

export const Popup: React.FC<Props> = ({ children, className }) => {
  return <Root className={className}>{children}</Root>;
};
