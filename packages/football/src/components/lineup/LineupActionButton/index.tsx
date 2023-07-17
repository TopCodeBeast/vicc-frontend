import styled from 'styled-components';

import { LinkOther } from '@sorare/core/src/atoms/navigation/Box';
import { text14 } from '@sorare/core/src/atoms/typography';

const LineupButton = styled(LinkOther)`
  border: 1px solid var(--c-neutral-400);
  border-radius: 16px;
  ${text14}
  font-weight: var(--t-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-neutral-1000);
  height: var(--quadruple-unit);
  box-sizing: border-box;
  gap: var(--unit);
  padding: 0 var(--triple-unit);
  background: var(--c-neutral-300);
  &:hover,
  &:focus {
    background: var(--c-neutral-400);
    color: initial;
  }
  &.primary {
    background: var(--c-brand-600);
    &:hover,
    &:focus {
      background: var(--c-brand-300);
      color: initial;
    }
    border: unset;
  }
`;

export default LineupButton;
