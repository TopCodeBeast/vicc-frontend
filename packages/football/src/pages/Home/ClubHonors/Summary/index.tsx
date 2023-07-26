import { gql } from '@apollo/client';
import styled from 'styled-components';

import CardRewards from '@football/pages/Home/ClubHonors/CardRewards';

import { ClubHonorsSummary_user } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: var(--double-unit);
  background: var(--c-neutral-200);
  border-radius: var(--double-unit);
  color: var(--c-neutral-1000);
  &:hover,
  &:active,
  &:focus {
    color: var(--c-neutral-1000);
  }
`;

type Props = {
  user?: ClubHonorsSummary_user;
  onClick?: () => void;
};
const ClubHonorsSummary = ({ user }: Props) => {
  if (!user) {
    return null;
  }

  return (
    <Wrapper>
      <CardRewards {...user.trophiesSummary} />
    </Wrapper>
  );
};

ClubHonorsSummary.fragments = {
  user: gql`
    fragment ClubHonorsSummary_user on PublicUserInfoInterface {
      slug
      trophiesSummary {
        limited: cardRewards(rarity: limited)
        rare: cardRewards(rarity: rare)
        superRare: cardRewards(rarity: super_rare)
        unique: cardRewards(rarity: unique)
        customSeries: cardRewards(rarity: custom_series)
        top1: podiumRankings(ranking: 1)
        top2: podiumRankings(ranking: 2)
        top3: podiumRankings(ranking: 3)
      }
    }
  `,
};

export default ClubHonorsSummary;
