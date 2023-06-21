import { ReactNode, useMemo } from 'react';
import styled from 'styled-components';

import { RainbowBox } from '@core/atoms/layout/RainbowBox';
import Shine from '@core/atoms/ui/Shine';
import { Star as StarIcon } from '@core/components/rewards/Star';
import { randomElement } from '@core/lib/arrays';

export const Star = styled(StarIcon)`
  background: linear-gradient(
    27.65deg,
    var(--c-static-reward-900) 21.95%,
    var(--c-static-reward-200) 109.77%
  );
  width: 12px;
  height: 12px;
  padding: 4px;
`;

const Wrapper = styled(RainbowBox)`
  width: 100%;
  padding: var(--half-unit) var(--unit);
  --inside: linear-gradient(
    84.1deg,
    rgba(248, 211, 218, 0.2) 0%,
    rgba(179, 169, 244, 0.2) 28.32%,
    rgba(251, 233, 251, 0.2) 54.01%,
    rgba(79, 148, 253, 0.2) 100%
  );
  display: flex;
  gap: var(--unit);
  align-items: center;
  white-space: nowrap;
  overflow: auto;
  .dark-theme & {
    background: var(--c-neutral-400);
  }
`;

type Props = {
  label: ReactNode;
};

export const HeadlineReward = ({ label }: Props) => {
  const frequency = useMemo(() => randomElement([7, 11, 13, 17, 19]), []);
  const delay = useMemo(() => `${Math.random() * -19}s`, []);
  return (
    <Shine
      style={
        {
          width: '100%',
          '--shine-delay': delay,
        } as React.CSSProperties
      }
      delayBetweenShines={frequency}
    >
      <Wrapper>{label}</Wrapper>
    </Shine>
  );
};
