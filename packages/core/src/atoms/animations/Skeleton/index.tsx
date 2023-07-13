import styled, { keyframes } from 'styled-components';

const skeletonKeyframes = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export const Skeleton = styled.div`
  --skeleton-highlight: rgba(var(--c-static-rgb-neutral-100), 0.5);
  display: inline-block;
  animation: ${skeletonKeyframes} 1300ms ease-in-out infinite;
  background: linear-gradient(
    to right,
    transparent,
    var(--skeleton-highlight),
    transparent
  );
  background-size: 200px 100%;
  background-repeat: no-repeat;
  border-radius: 4px;
`;
