import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { Text16 } from '@sorare/core/src/atoms/typography';

import RewardIcon from '@football/components/rewards/RewardIcon';

import { Bronze, Gold, Silver } from './trophy';

const Trophies = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--double-unit);
`;
const Rank = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

type Props = {
  top1: number;
  top2: number;
  top3: number;
  limited: number;
  rare: number;
  superRare: number;
  unique: number;
  customSeries: number;
};
const CardRewards = ({
  top1,
  top2,
  top3,
  limited,
  rare,
  superRare,
  unique,
  customSeries,
}: Props) => {
  return (
    <Trophies>
      {[
        {
          key: 'top1',
          value: top1,
          icon: <Gold />,
        },
        {
          key: 'top2',
          value: top2,
          icon: <Silver />,
        },
        {
          key: 'top3',
          value: top3,
          icon: <Bronze />,
        },
        {
          key: 'unique',
          value: unique,
          icon: <RewardIcon scarcity={Rarity.unique} />,
        },
        {
          key: 'super_rare',
          value: superRare,
          icon: <RewardIcon scarcity={Rarity.super_rare} />,
        },
        {
          key: 'rare',
          value: rare,
          icon: <RewardIcon scarcity={Rarity.rare} />,
        },
        {
          key: 'limited',
          value: limited,
          icon: <RewardIcon scarcity={Rarity.limited} />,
        },
        {
          key: 'customSeries',
          value: customSeries,
          icon: <RewardIcon scarcity={Rarity.custom_series} />,
        },
      ].map(
        ({ key, value, icon }) =>
          !!value && (
            <Rank key={key}>
              {icon}
              <Text16 color="var(--c-neutral-600)" bold>
                {value}
              </Text16>
            </Rank>
          )
      )}
    </Trophies>
  );
};

export default CardRewards;
