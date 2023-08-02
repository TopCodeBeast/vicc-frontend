import { TypedDocumentNode, gql } from '@apollo/client';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { isType } from '@sorare/core/src/lib/gql';

import DumbSo5Reward from './DumbSo5Reward';
import { Reward_userAccountEntry } from './__generated__/index.graphql';

type Props = {
  userAccountEntry: Reward_userAccountEntry;
  primaryCurrency: Currency;
};

type Reward_userAccountEntry_tokenOperation_So5Reward =
  Reward_userAccountEntry['tokenOperation'] & {
    __typename: 'So5Reward';
  };

const generateLink = (
  so5Ranking: NonNullable<
    Reward_userAccountEntry_tokenOperation_So5Reward['so5Ranking']
  >
) => {
  const { so5Leaderboard } = so5Ranking;
  return {
    slug: so5Leaderboard.so5Fixture?.slug,
    ranking: so5Ranking.ranking,
    leaderboard: so5Leaderboard.displayName,
    gameWeek: so5Leaderboard.so5Fixture.gameWeek,
  };
};

export const Reward = ({ userAccountEntry, primaryCurrency }: Props) => {
  const { tokenOperation } = userAccountEntry;

  if (
    !isType(tokenOperation, 'So5Reward') &&
    !isType(tokenOperation, 'TokenMonetaryReward')
  ) {
    return null;
  }

  const link =
    isType(tokenOperation, 'So5Reward') && tokenOperation.so5Ranking
      ? generateLink(tokenOperation.so5Ranking)
      : undefined;

  return (
    <DumbSo5Reward
      userAccountEntry={userAccountEntry}
      primaryCurrency={primaryCurrency}
      link={link}
    />
  );
};

Reward.fragments = {
  userAccountEntry: gql`
    fragment Reward_userAccountEntry on UserAccountEntry {
      id
      ...DumbSo5Reward_userAccountEntry
      tokenOperation {
        ... on TokenMonetaryReward {
          id
        }
        ... on So5Reward {
          slug
          so5Ranking {
            id
            ranking
            so5Leaderboard {
              slug
              displayName
              so5Fixture {
                slug
                gameWeek
              }
            }
          }
        }
      }
    }
    ${DumbSo5Reward.fragments.userAccountEntry}
  ` as TypedDocumentNode<Reward_userAccountEntry>,
};
