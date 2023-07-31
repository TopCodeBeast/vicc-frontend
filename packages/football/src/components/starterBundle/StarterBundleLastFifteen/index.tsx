import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';

import { THRESHOLD_COLORS, thresholds } from '@football/components/stats/PlayerScore';

import { StarterBundleLastFifteen_card } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--intermediate-unit) var(--double-unit);
  border-top: 1px solid var(--c-neutral-300);
`;

const Coloured = styled.div<{ color: string }>`
  color: ${({ color }) => color};
`;

export const starterThresholds = thresholds.map(t => [
  (t[0] as number) * 5,
  t[1],
]);

const findStarterThreshold = (score: number) => {
  const starterThreshold = starterThresholds.find(t => Number(t[0]) > score);
  return starterThreshold ? starterThreshold[1] : 'high';
};

type Props = {
  cards: StarterBundleLastFifteen_card[];
};

export const StarterBundleLastFifteen = ({ cards }: Props) => {
  const lastFifteen = cards.reduce<number>((acc, c) => {
    return acc + (c.player?.lastFifteenSo5AverageScore || 0);
  }, 0);

  const thresold = findStarterThreshold(lastFifteen);

  return (
    <Wrapper>
      <Text16 color="var(--c-neutral-600)">
        <FormattedMessage
          id="starterBundle.last15"
          defaultMessage="Last 15 games average team score"
        />
      </Text16>
      <Coloured color={THRESHOLD_COLORS[thresold]}>
        <Text16 bold>{lastFifteen}</Text16>
      </Coloured>
    </Wrapper>
  );
};

StarterBundleLastFifteen.fragments = {
  card: gql`
    fragment StarterBundleLastFifteen_card on Card {
      slug
      assetId
      player {
        slug
        lastFifteenSo5AverageScore: averageScore(
          type: LAST_FIFTEEN_VICC5_AVERAGE_SCORE
        )
      }
    }
  `,
};

export default StarterBundleLastFifteen;
