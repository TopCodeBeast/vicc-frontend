import { TypedDocumentNode, gql } from '@apollo/client';
import qs from 'qs';

import { FOOTBALL_TRANSFER_MARKET } from '@sorare/core/src/constants/routes';
import { withFragments } from '@sorare/core/src/lib/gql';

import { getMarketUrl_vicc5Leaderboard } from './__generated__/getMarketUrl.graphql';

export const getMarketUrl = withFragments(
  (vicc5Leaderboard: getMarketUrl_vicc5Leaderboard) => {
    return `${FOOTBALL_TRANSFER_MARKET}?${qs.stringify({
      leaderboard: vicc5Leaderboard.slug,
    })}&${vicc5Leaderboard.canCompose.transferMarketFilters}`;
  },
  {
    vicc5Leaderboard: gql`
      fragment getMarketUrl_vicc5Leaderboard on Vicc5Leaderboard {
        slug
        canCompose {
          transferMarketFilters
        }
      }
    ` as TypedDocumentNode<getMarketUrl_vicc5Leaderboard>,
  }
);
