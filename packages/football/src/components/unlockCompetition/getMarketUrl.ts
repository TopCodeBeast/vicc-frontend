import { TypedDocumentNode, gql } from '@apollo/client';
import qs from 'qs';

import { FOOTBALL_TRANSFER_MARKET } from '@sorare/core/src/constants/routes';
import { withFragments } from '@sorare/core/src/lib/gql';

import { getMarketUrl_so5Leaderboard } from './__generated__/getMarketUrl.graphql';

export const getMarketUrl = withFragments(
  (so5Leaderboard: getMarketUrl_so5Leaderboard) => {
    return `${FOOTBALL_TRANSFER_MARKET}?${qs.stringify({
      leaderboard: so5Leaderboard.slug,
    })}&${so5Leaderboard.canCompose.transferMarketFilters}`;
  },
  {
    so5Leaderboard: gql`
      fragment getMarketUrl_so5Leaderboard on So5Leaderboard {
        slug
        canCompose {
          transferMarketFilters
        }
      }
    ` as TypedDocumentNode<getMarketUrl_so5Leaderboard>,
  }
);
