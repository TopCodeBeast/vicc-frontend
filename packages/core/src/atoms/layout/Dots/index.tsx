import styled from 'styled-components';

import { range } from '@sorare/core/src/lib/arrays';

const FlexContainer = styled.div`
  display: flex;
  gap: var(--unit);
  justify-content: center;
`;
const Dot = styled.button<{ active: boolean }>`
  width: var(--unit);
  height: var(--unit);
  border-radius: 100%;
  background-color: ${({ active }) =>
    active ? 'var(--c-neutral-1000)' : 'var(--c-neutral-300)'};
`;

type Props = {
  count: number;
  current: number;
  onChange: (n: number) => void;
};
const Dots = ({ count, current, onChange }: Props) => (
  <FlexContainer>
    {range(count).map(i => (
      <Dot key={i} onClick={() => onChange(i)} active={current === i} />
    ))}
  </FlexContainer>
);

export default Dots;
