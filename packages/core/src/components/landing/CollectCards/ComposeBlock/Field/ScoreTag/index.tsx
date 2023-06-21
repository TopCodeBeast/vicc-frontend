import { animated, useSpring } from '@react-spring/web';
import styled from 'styled-components';

import { theme } from '@core/style/theme';

const Tag = styled(animated.span)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: var(--scoreTagMin, 20px);
  width: var(--scoreTagMin, var(--double-and-a-half-unit));
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  padding: 0;
  background-color: #01a98b;
  color: var(--c-neutral-100);

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    height: var(--scoreTagMax, 30px);
    width: var(--scoreTagMax, 30px);
    font-size: 16px;
  }
`;

type Props = {
  visible: boolean;
  toValue: number;
};

const ScoreTag = ({ visible, toValue }: Props) => {
  const fromDef = { value: 0 };
  const toDef = { value: toValue };
  const { value } = useSpring({
    config: { mass: 1, tension: 120, friction: 30 },
    from: visible ? fromDef : toDef,
    to: visible ? toDef : fromDef,
    delay: 500,
  });

  return (
    <Tag>
      {value.to(x => {
        const int = Math.floor(x);
        if (int === 0) return '';
        return int;
      })}
    </Tag>
  );
};

export default ScoreTag;
