import { HTMLAttributes } from 'react';
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  isolation: isolate;
`;

const shineAnimation = (delayBetweenShines: number) => keyframes`
from {
    transform: translateX(0) translateY(0) rotate(45deg) scale(1, 10);
  }
  ${`${100 / (delayBetweenShines + 1)}%`},
  100% {
    transform: translateX(calc((var(--fraction) + 1) * 100%))
      translateY(200%) rotate(45deg) scale(1, 10);
  }
`;

const ShineAnimation = styled.div<{
  $borderRadius: string;
  $shine: boolean;
  $delayBetweenShines: number;
  $infinite: boolean;
  $fraction: number;
}>`
  position: absolute;
  inset: 0;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  overflow: hidden;
  /* Fix safari overflow bug */
  /* https://stackoverflow.com/questions/48470833/overflow-not-hidden-while-css-animation-in-safari */
  transform: translate3d(0, 0, 0);
  pointer-events: none;
  &::before {
    content: '';
    z-index: 0;
    display: block;
    position: absolute;
    --fraction: ${({ $fraction }) => $fraction};
    width: calc(100% / var(--fraction));
    height: 100%;
    right: 100%;
    bottom: 100%;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.5),
      transparent
    );
    transform-origin: center;
    animation: ${({ $delayBetweenShines }) =>
        shineAnimation($delayBetweenShines)}
      ${({ $delayBetweenShines }) => $delayBetweenShines + 1}s linear
      var(--shine-delay, 0.25s)
      ${({ $infinite }) => ($infinite ? 'infinite' : '1')};
    animation-play-state: ${({ $shine }) => ($shine ? 'running' : 'paused')};
    opacity: ${({ $shine }) => ($shine ? 1 : 0)};
  }
`;

type Props = {
  className?: string;
  disabled?: boolean;
  borderRadius?: string;
  delayBetweenShines?: number;
  infinite?: boolean;
  fraction?: number;
} & HTMLAttributes<HTMLElement>;

export const Shine: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
  disabled = false,
  borderRadius = '0px',
  delayBetweenShines = 4,
  infinite = true,
  fraction = 5,
  ...divAttributes
}) => (
  <Wrapper className={className} {...divAttributes}>
    {children}
    <ShineAnimation
      $shine={!disabled}
      $borderRadius={borderRadius}
      $delayBetweenShines={delayBetweenShines}
      $infinite={infinite}
      $fraction={fraction}
    />
  </Wrapper>
);

export default Shine;
