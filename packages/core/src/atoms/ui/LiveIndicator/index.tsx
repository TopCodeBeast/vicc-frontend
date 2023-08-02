import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(var(--rgb-bg-color), 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(var(--rgb-bg-color), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--rgb-bg-color), 0);
  }
`;

export const LiveIndicator = styled.div.attrs({ 'aria-label': 'Live' })`
  --rgb-bg-color: var(--c-rgb-red-600);

  width: var(--unit);
  height: var(--unit);
  border-radius: 50%;
  display: inline-block;
  animation: ${pulse} 1.2s ease-in-out infinite;
  background-color: rgb(var(--rgb-bg-color));
`;
