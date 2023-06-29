import styled from 'styled-components';

import {
  CardQuality,
  Rarity,
} from '@sorare/core/src/__generated__/globalTypes';
import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';

export type CardsByTier = {
  [key in CardQuality]: number;
};

const Root = styled.div`
  display: flex;
  gap: var(--half-unit);
  align-items: center;
  background-color: var(--c-neutral-400);
  padding: 2px 2px 2px var(--half-unit);
  border-radius: var(--half-unit);
`;
const TiersContainer = styled.div`
  --radius: 3px;
  display: flex;
  align-items: center;
  gap: 1px;
  & > :first-child {
    border-top-left-radius: var(--radius);
    border-bottom-left-radius: var(--radius);
  }
  & > :last-child {
    border-top-right-radius: var(--radius);
    border-bottom-right-radius: var(--radius);
  }
`;
const Tier = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--half-unit);
  background-color: var(--c-neutral-300);
  padding: 0 var(--half-unit);
`;
const TierLabel = styled.p`
  font-weight: 400;
  color: var(--c-neutral-700);
`;
const TierAmount = styled.p`
  color: var(--c-neutral-500);
`;

type Props = {
  rarity: Rarity;
  tiers: CardsByTier;
};
const CardRewardsByTier = ({ rarity, tiers }: Props) => {
  const total = Object.values(tiers).reduce((sum, value) => sum + value, 0);
  return (
    <Root>
      <ScarcityIcon scarcity={rarity} />
      {total}
      <TiersContainer>
        {tiers.TIER_0 > 0 && (
          <Tier>
            <TierLabel>T0</TierLabel>
            <TierAmount>{tiers.TIER_0}</TierAmount>
          </Tier>
        )}
        {tiers.TIER_1 > 0 && (
          <Tier>
            <TierLabel>T1</TierLabel>
            <TierAmount>{tiers.TIER_1}</TierAmount>
          </Tier>
        )}
        {tiers.TIER_2 > 0 && (
          <Tier>
            <TierLabel>T2</TierLabel>
            <TierAmount>{tiers.TIER_2}</TierAmount>
          </Tier>
        )}
        {tiers.TIER_3 > 0 && (
          <Tier>
            <TierLabel>T3</TierLabel>
            <TierAmount>{tiers.TIER_3}</TierAmount>
          </Tier>
        )}
        {tiers.TIER_4 > 0 && (
          <Tier>
            <TierLabel>T4</TierLabel>
            <TierAmount>{tiers.TIER_4}</TierAmount>
          </Tier>
        )}
        {tiers.TIER_5 > 0 && (
          <Tier>
            <TierLabel>T5</TierLabel>
            <TierAmount>{tiers.TIER_5}</TierAmount>
          </Tier>
        )}
      </TiersContainer>
    </Root>
  );
};

export default CardRewardsByTier;
