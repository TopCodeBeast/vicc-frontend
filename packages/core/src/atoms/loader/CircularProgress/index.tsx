import styled, { keyframes } from 'styled-components';

const arcAnimation = (length: number) => keyframes`
  from {
    stroke-dashoffset: ${length};
  }
  to {
    stroke-dashoffset: 0;
  }
`;

// svg circles start at 3 o'clock position and go clockwise
const Circle = styled.circle`
  fill: none;
  stroke: var(--circular-background-stroke, var(--c-static-neutral-400));
  transform-origin: center;
  transform: rotate(-90deg);
`;

const BackgroundCircle = styled(Circle)`
  opacity: 0.4;
`;

const ForegroundCircle = styled(Circle)<{ length: number }>`
  stroke-dashoffset: 200;
  stroke: var(--circular-progress-stroke, var(--c-static-neutral-200));
  animation: ${({ length }) => arcAnimation(length)} 1s forwards ease-in;
`;

export type Props = {
  progress: number;
  maxProgress: number;
  className?: string;
};

export const CircularProgress = ({
  progress,
  maxProgress,
  className,
}: Props) => {
  const radius = 80;
  const strokeWidth = 50;
  const effectiveRadius = radius - strokeWidth / 2;
  const perimeter = 2 * Math.PI * effectiveRadius;
  const progressLength = perimeter * (progress / maxProgress);
  const remainingLength = perimeter - progressLength;

  return (
    <svg
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <BackgroundCircle
        cx={radius}
        cy={radius}
        r={effectiveRadius}
        strokeWidth={strokeWidth}
      />
      <ForegroundCircle
        cx={radius}
        cy={radius}
        r={effectiveRadius}
        strokeWidth={strokeWidth}
        strokeDasharray={`${progressLength} ${
          progressLength + remainingLength
        }`}
        length={progressLength}
      />
    </svg>
  );
};

export default CircularProgress;
