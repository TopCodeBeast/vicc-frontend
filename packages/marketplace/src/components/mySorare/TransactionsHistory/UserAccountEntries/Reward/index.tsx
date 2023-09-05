import { TypedDocumentNode, gql } from '@apollo/client';

import { Currency } from '@sorare/core/src/__generated__/globalTypes';
import { isType } from '@sorare/core/src/lib/gql';

import DumbVicc5Reward from './DumbSo5Reward';
import { Reward_userAccountEntry } from './__generated__/index.graphql';

type Props = {
  userAccountEntry: Reward_userAccountEntry;
  primaryCurrency: Currency;
};

type Reward_userAccountEntry_tokenOperation_Vicc5Reward =
  Reward_userAccountEntry['tokenOperation'] & {
    __typename: 'Vicc5Reward';
  };

const generateLink = (
  vicc5Ranking: NonNullable<
    Reward_userAccountEntry_tokenOperation_Vicc5Reward['vicc5Ranking']
  >
) => {
  const { vicc5Leaderboard } = vicc5Ranking;
  return {
    slug: vicc5Leaderboard.vicc5Fixture?.slug,
    ranking: vicc5Ranking.ranking,
    leaderboard: vicc5Leaderboard.displayName,
    gameWeek: vicc5Leaderboard.vicc5Fixture.gameWeek,
  };
};

export const Reward = ({ userAccountEntry, primaryCurrency }: Props) => {
  const { tokenOperation } = userAccountEntry;

  if (
    !isType(tokenOperation, 'Vicc5Reward') &&
    !isType(tokenOperation, 'TokenMonetaryReward')
  ) {
    return null;
  }

  const link =
    isType(tokenOperation, 'Vicc5Reward') && tokenOperation.vicc5Ranking
      ? generateLink(tokenOperation.vicc5Ranking)
      : undefined;

  return (
    <DumbVicc5Reward
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
      ...DumbVicc5Reward_userAccountEntry
      tokenOperation {
        ... on TokenMonetaryReward {
          id
        }
        ... on Vicc5Reward {
          slug
          vicc5Ranking {
            id
            ranking
            vicc5Leaderboard {
              slug
              displayName
              vicc5Fixture {
                slug
                gameWeek
              }
            }
          }
        }
      }
    }
    ${DumbVicc5Reward.fragments.userAccountEntry}
  ` as TypedDocumentNode<Reward_userAccountEntry>,
};
