import classnames from 'classnames';
import styled from 'styled-components';

import { ShirtSize } from '@sorare/core/src/__generated__/globalTypes';

const SizeSelectorWrapper = styled.div`
  display: flex;
  gap: var(--unit);
  justify-content: center;
  margin-bottom: var(--double-unit);
`;
const Selector = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--unit) var(--double-unit);
  border-radius: var(--unit);
  background-color: var(--c-neutral-300);
  width: 50px;
  &.active {
    background-color: var(--c-neutral-500);
  }
  &:disabled {
    opacity: 0.8;
    color: var(--c-neutral-500);
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: var(--unit);
      background: linear-gradient(
        to top right,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) calc(50% - 0.8px),
        rgba(var(--c-rgb-neutral-500), 1) 50%,
        rgba(0, 0, 0, 0) calc(50% + 0.8px),
        rgba(0, 0, 0, 0) 100%
      );
    }
  }
`;

type Props = {
  shirtSizes: { size: ShirtSize; soldOut: boolean }[];
  selectedSize: ShirtSize | null;
  onChange: React.Dispatch<React.SetStateAction<ShirtSize | null>>;
};
export const SizeSelector = ({ shirtSizes, selectedSize, onChange }: Props) => {
  return (
    <SizeSelectorWrapper>
      {shirtSizes.map(({ size, soldOut }) => {
        return (
          <Selector
            key={size}
            onClick={() => onChange?.(size)}
            disabled={soldOut}
            className={classnames({
              active: selectedSize === size,
            })}
          >
            {size}
          </Selector>
        );
      })}
    </SizeSelectorWrapper>
  );
};
