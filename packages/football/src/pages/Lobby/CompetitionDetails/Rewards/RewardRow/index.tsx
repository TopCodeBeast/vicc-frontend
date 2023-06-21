import styled from 'styled-components';

import { theme } from '@sorare/core/src/style/theme';

export const RewardRowsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

export const RewardRow = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
  color: inherit;
  padding: var(--unit) var(--intermediate-unit);
`;

export const HighlightedRewardRow = styled(RewardRow)`
  background: linear-gradient(
    99.55deg,
    rgba(219, 0, 255, 0.25) 0%,
    rgba(0, 56, 255, 0.25) 100%
  );
  border: 1px solid rgba(0, 56, 255, 0.5);
  box-sizing: border-box;
  margin: var(--half-unit);
  border-radius: ${theme.radius.sm}px;
`;

export const ActionableRewardRow = styled(RewardRow)`
  &:hover,
  &:focus {
    background-color: var(--c-neutral-400);
  }
`;
