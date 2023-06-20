import { ReactNode } from 'react';
import styled from 'styled-components';

import TooltipContent from '@sorare/core/src/atoms/tooltip/TooltipContent';
import { theme } from '@sorare/core/src/style/theme';

type Props = {
  message: ReactNode;
  position: 'left' | 'right';
};

const Root = styled.div`
  z-index: ${theme.zIndex.tooltip};
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    position: absolute;
    &.left {
      right: calc(100% + 20px);
    }
    &.right {
      left: calc(100% + 20px);
    }
    width: 220px;
    top: 0;
    margin: 0;
  }
`;
const Anchor = styled.div`
  z-index: ${theme.zIndex.tooltip};
  background-color: var(--c-yellow-600);
  height: 17px;
  width: 17px;
  flex-shrink: 0;
  flex-grow: 0;
  border-radius: 50%;
  display: none;
  position: absolute;
  top: 40px;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    display: initial;
  }
  &.left {
    left: -8px;
  }
  &.right {
    right: -8px;
  }
`;

export const OnboardingTooltip = (props: Props) => {
  const { message, position } = props;

  return (
    <>
      <Root className={position}>
        <TooltipContent>{message}</TooltipContent>
      </Root>
      <Anchor className={position} />
    </>
  );
};

export default OnboardingTooltip;
