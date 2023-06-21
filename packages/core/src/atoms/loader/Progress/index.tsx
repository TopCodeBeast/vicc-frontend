import { HTMLAttributes } from 'react';
import { animated, config, useSpring } from '@react-spring/web';
import { useFirstMountState } from 'react-use';
import styled from 'styled-components';

const ProgressStyled = styled(animated.progress)`
  appearance: none;
  line-height: 1;
  vertical-align: bottom;
  height: var(--unit);
  width: 100%;
  &::-webkit-progress-bar {
    background: var(--progress-background-color, var(--c-neutral-300));
    border-radius: var(--unit);
  }
  &::-webkit-progress-value {
    background: var(--progress-color, var(--c-brand-600));
    border-radius: var(--unit);
  }
`;

type Props = {
  value: number;
  min?: number;
  max: number;
  skipStartAnimation?: boolean;
  className?: string;
} & HTMLAttributes<HTMLProgressElement>;

export const Progress = ({
  value: toValue,
  min = 0,
  max,
  skipStartAnimation = false,
  className,
  ...htmlProps
}: Props) => {
  const firstRender = useFirstMountState();
  const { value } = useSpring({
    config: config.gentle,
    from: { value: min },
    to: { value: Math.min(Math.max(toValue, min), max) },
    immediate: skipStartAnimation && firstRender,
  });

  return (
    <ProgressStyled
      max={max}
      value={value}
      className={className}
      {...htmlProps}
    />
  );
};
