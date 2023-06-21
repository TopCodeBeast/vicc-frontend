import styled from 'styled-components';

import { range } from '@core/lib/arrays';

const Root = styled.div`
  display: flex;
`;

const Dot = styled.div<{ small?: boolean }>`
  --dot-size: ${({ small }) => (small ? '4px' : '6px')};
  background-color: var(--c-neutral-1000);
  width: var(--dot-size);
  height: var(--dot-size);

  border-radius: 50%;
  animation: 1.8s ease-in-out bouncing infinite;

  &:not(:last-child) {
    margin-right: 3px;
  }

  &:nth-child(2) {
    animation-delay: 0.3s;
  }

  &:nth-child(3) {
    animation-delay: 0.6s;
  }

  @keyframes bouncing {
    0% {
      transform: translate(0);
    }
    25% {
      transform: translate(0, 60%);
      opacity: 0.5;
    }
    50% {
      transform: translate(0);
      opacity: 1;
    }
    75% {
      transform: translate(0);
    }
    100% {
      transform: translate(0);
    }
  }
`;

export const DotsLoader = ({ small }: { small?: boolean }) => {
  return (
    <Root>
      {range(3).map(i => (
        <Dot key={i} small={small} />
      ))}
    </Root>
  );
};

export default DotsLoader;
