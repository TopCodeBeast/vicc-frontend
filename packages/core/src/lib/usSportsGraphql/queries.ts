import { gql } from '@apollo/client';

const USSPORTS_PAST_WINNER_LINEUP_FRAGMENT = gql`
  fragment USSportsPastWinner_LineupInterface on LineupInterface {
    id
    score
    user {
      slug
      nickname
      suspended
      avatarUrl
    }
    cards {
      card {
        slug
        assetId
        fullImageUrl
      }
    }
  }
`;

const USSPORTS_PAST_WINNER_LEADERBOARD_FRAGMENT = gql`
  fragment USSportsPastWinner_LeaderboardInterface on LeaderboardInterface {
    slug
    displayName
    iconImageUrl
    lineupsCount
    leaderboardRarity
    ... on BaseballLeaderboard {
      lineups(first: 1) {
        nodes {
          ...USSportsPastWinner_LineupInterface
        }
      }
    }
    ... on NBALeaderboard {
      lineups(first: 1) {
        nodes {
          ...USSportsPastWinner_LineupInterface
        }
      }
    }
  }
  ${USSPORTS_PAST_WINNER_LINEUP_FRAGMENT}
`;

export const NBA_PAST_WINNER_QUERY = gql`
  query NBAPastWinnerQuery {
    nbaPastFixtures(first: 1) {
      nodes {
        slug
        leaderboards {
          slug
          ...USSportsPastWinner_LeaderboardInterface
        }
      }
    }
  }
  ${USSPORTS_PAST_WINNER_LEADERBOARD_FRAGMENT}
`;

export const BASEBALL_PAST_WINNER_QUERY = gql`
  query BaseballPastWinnerQuery {
    baseballPastFixtures(first: 1) {
      nodes {
        slug
        leaderboards {
          slug
          ...USSportsPastWinner_LeaderboardInterface
        }
      }
    }
  }
  ${USSPORTS_PAST_WINNER_LEADERBOARD_FRAGMENT}
`;

export const BASEBALL_REFERRAL_REWARDS_QUERY = gql`
  query BaseballReferralRewardsQuery($referralIDs: [UUID!]!) {
    usSportReferralRewards: baseballReferralRewards(referralIDs: $referralIDs) {
      id
      state
      card {
        id
        slug
        assetId
        positions
        rarity
        player {
          slug
          positions
        }
        team {
          slug
          svgUrl
        }
      }
    }
  }
`;

export const NBA_REFERRAL_REWARDS_QUERY = gql`
  query NBAReferralRewardsQuery($referralIDs: [UUID!]!) {
    usSportReferralRewards: nbaReferralRewards(referralIDs: $referralIDs) {
      id
      state
      card {
        id
        slug
        assetId
        positions
        rarity
        player {
          slug
          positions
        }
        team {
          slug
          svgUrl
        }
      }
    }
  }
`;

export const CLAIM_BASEBALL_REFERRAL_REWARDS_MUTATION = gql`
  mutation ClaimBaseballReferralRewardsMutation($referralIDs: [UUID!]!) {
    claimBaseballReferralRewards(referralIDs: $referralIDs) {
      id
      state
    }
  }
`;

export const CLAIM_NBA_REFERRAL_REWARDS_MUTATION = gql`
  mutation ClaimNBAReferralRewardsMutation($referralIDs: [UUID!]!) {
    claimNBAReferralRewards(referralIDs: $referralIDs) {
      id
      state
    }
  }
`;

const playerDescriptionPlayerInterfaceFragment = gql`
  fragment PlayerDescription_playerInterface on PlayerInterface {
    slug
    displayName
    team {
      slug
      name
    }
    shirtNumber
    avatarImageUrl
  }
`;

export const US_SPORTS_PLAYER_DESCRIPITON_FRAGMENTS = {
  player: playerDescriptionPlayerInterfaceFragment,
  baseballPlayer: gql`
    fragment PlayerDescription_baseballPlayer on BaseballPlayer {
      slug
      positions
      ...PlayerDescription_playerInterface
    }
    ${playerDescriptionPlayerInterfaceFragment}
  `,
  nbaPlayer: gql`
    fragment PlayerDescription_NBAPlayer on NBAPlayer {
      slug
      positions
      ...PlayerDescription_playerInterface
    }
    ${playerDescriptionPlayerInterfaceFragment}
  `,
};

export const US_SPORTS_USER_FRAGMENTS = {
  nickname: gql`
    fragment Nickname_usSportsUser on User {
      nickname
      suspended
      slug
    }
  `,
};

export const US_SPORTS_FOLLOW_DESCRIPTION_FRAGMENTS = {
  baseballPlayer: gql`
    fragment FollowDescription_baseballPlayer on BaseballPlayer {
      slug
      ...PlayerDescription_baseballPlayer
    }
    ${US_SPORTS_PLAYER_DESCRIPITON_FRAGMENTS.baseballPlayer}
  `,
  nbaPlayer: gql`
    fragment FollowDescription_NBAPlayer on NBAPlayer {
      slug
      ...PlayerDescription_NBAPlayer
    }
    ${US_SPORTS_PLAYER_DESCRIPITON_FRAGMENTS.nbaPlayer}
  `,
};

export const US_SPORTS_FOLLOW_FRAGMENTS = {
  baseballPlayer: gql`
    fragment Follow_baseballPlayer on BaseballPlayer {
      slug
      ...PlayerDescription_baseballPlayer
    }
    ${US_SPORTS_PLAYER_DESCRIPITON_FRAGMENTS.baseballPlayer}
  `,
  nbaPlayer: gql`
    fragment Follow_NBAPlayer on NBAPlayer {
      slug
      ...PlayerDescription_NBAPlayer
    }
    ${US_SPORTS_PLAYER_DESCRIPITON_FRAGMENTS.nbaPlayer}
  `,
};

export const BASEBALL_SUBSCRIPTION_ITEMS_QUERY = gql`
  query BaseballSubscriptionItemsQuery($slugs: [String!]!) {
    players: baseballPlayers(slugs: $slugs) {
      slug
      ...Follow_baseballPlayer
    }
  }
  ${US_SPORTS_FOLLOW_FRAGMENTS.baseballPlayer}
`;

export const NBA_SUBSCRIPTION_ITEMS_QUERY = gql`
  query NBASubscriptionItemsQuery($slugs: [String!]!) {
    players: nbaPlayers(slugs: $slugs) {
      slug
      ...Follow_NBAPlayer
    }
  }
  ${US_SPORTS_FOLLOW_FRAGMENTS.nbaPlayer}
`;
