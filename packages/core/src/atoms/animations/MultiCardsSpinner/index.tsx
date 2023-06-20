import { Children, ReactNode, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotateY(0);
  }

  to {
    transform: rotateY(360deg);
  }
`;

const Flatten = styled.div`
  position: relative;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  max-height: 100%;
`;

const Spinner3D = styled.div`
  transform-origin: center bottom;
  transform-style: preserve-3d;
  animation: ${spin} 25s linear infinite;
  > * {
    transform: rotateY(calc(360deg / var(--nbCards) * var(--itemIndex)))
      rotateX(-5deg) translateY(0) translateZ(var(--circleRadius))
      scale(var(--scaleFactor));
  }
  > *:not(:first-child) {
    position: absolute;
    inset: 0;
  }
`;

const RotatingPlane = styled.div`
  transform-style: preserve-3d;
`;

type Props = {
  children: ReactNode;
  noRandomness?: boolean;
  itemWidth?: number;
};

export const MultiCardsSpinner = ({
  children,
  noRandomness,
  itemWidth = 160,
}: Props) => {
  const delay = useMemo(
    () => (noRandomness ? 0 : Math.round(Math.random() * -25)),
    [noRandomness]
  );

  const elementsToDisplay = Children.toArray(children);
  const nbCards = elementsToDisplay.length;
  const scaleFactor = 0.5;
  const circleRadius =
    (1.2 * nbCards * itemWidth * scaleFactor) / (2 * Math.PI);

  return (
    <Flatten>
      <Spinner3D
        style={
          {
            '--nbCards': elementsToDisplay.length,
            '--circleRadius': `${circleRadius}px`,
            '--scaleFactor': scaleFactor,
            animationDelay: `${delay}s`,
          } as React.CSSProperties
        }
      >
        {Children.toArray(children).map((child, index) => (
          <RotatingPlane
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            style={
              {
                '--itemIndex': index,
              } as React.CSSProperties
            }
          >
            {child}
          </RotatingPlane>
        ))}
      </Spinner3D>
    </Flatten>
  );
};
