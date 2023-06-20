import { HTMLAttributes } from 'react';
import styled from 'styled-components';

const revealDurationSeconds = 1;
const timingFunction = 'cubic-bezier(0.17, 0.17, 0.1, 0.76)';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  > * {
    grid-row-start: 1;
    grid-column-start: 1;
  }
  animation: reveal ${revealDurationSeconds}s;
  animation-timing-function: ${timingFunction};

  @keyframes reveal {
    0% {
      transform: rotateY(60deg) scale(0.5);
    }
    7% {
      transform: rotateY(60deg) scale(0.5);
    }
    90% {
      transform: rotateY(0deg) scale(1);
    }
    100% {
      transform: rotateY(0deg) scale(1);
    }
  }
`;

const Clip = styled.div`
  animation: clip ${revealDurationSeconds}s;
  animation-timing-function: ${timingFunction};
  img {
    max-width: 100%;
  }
  @keyframes clip {
    0% {
      clip-path: inset(100% 0 0 0);
    }
    7% {
      clip-path: inset(100% 0 0 0);
    }
    90% {
      clip-path: inset(0% 0 0 0);
    }
    100% {
      clip-path: inset(0% 0 0 0);
    }
  }
`;

const Highlight = styled.div`
  height: 7px;
  border-radius: 4px;
  margin: 0 -4px;
  position: relative;
  transform: scale(0, 1);
  transform-origin: center;
  background-color: white;
  animation: wipe ${revealDurationSeconds}s;
  animation-timing-function: ${timingFunction};
  box-shadow: 0 0 20px 5px var(--c-neutral-100);

  @keyframes wipe {
    0% {
      transform: scale(0, 1);
      top: 100%;
    }
    7% {
      transform: scale(1, 1);
      top: 100%;
    }
    90% {
      transform: scale(1, 1);
      top: 0;
    }
    100% {
      transform: scale(0, 1);
    }
  }
`;

export const LaserReveal: React.FC<HTMLAttributes<HTMLElement>> = ({
  children,
  ...props
}) => {
  return (
    <Wrapper {...props}>
      <Clip>{children}</Clip>
      <Highlight />
    </Wrapper>
  );
};
