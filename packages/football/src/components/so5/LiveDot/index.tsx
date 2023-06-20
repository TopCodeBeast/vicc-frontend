import classNames from 'classnames';
import styled, { css, keyframes } from 'styled-components';

type Props = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
};

const Wrapper = styled.span`
  display: block;
  position: relative;
`;

const pulsate = keyframes`
    50% {
      transform: scale(0.1);
      opacity: 0;
    }
    75% {
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
`;

const dotSizeStyle = css`
  width: 6px;
  &.md {
    width: 8px;
  }
  &.lg {
    width: 10px;
  }
  &.xl {
    width: 12px;
  }
`;

const Pulsation = styled.span`
  inset: 0;
  border: 1px solid var(--c-static-red-300);
  border-radius: 30px;
  aspect-ratio: 1;
  position: absolute;
  &.animate {
    animation: ${pulsate} 3s ease-out infinite;
  }
  opacity: 0;
  ${dotSizeStyle}
  &.sm {
    border-width: 0.5px;
  }
`;

const Dot = styled.span`
  display: block;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--c-static-red-300);
  ${dotSizeStyle}
`;

export const LiveDot = ({ size = 'sm', animate }: Props) => {
  return (
    <Wrapper>
      <Pulsation className={classNames({ [size]: true, animate })} />
      <Dot className={size} />
    </Wrapper>
  );
};
