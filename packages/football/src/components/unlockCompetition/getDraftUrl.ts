import { TypedDocumentNode, gql } from '@apollo/client';
import { generatePath } from 'react-router-dom';

import { FOOTBALL_DRAFT } from '@sorare/core/src/constants/routes';
import { withFragments } from '@sorare/core/src/lib/gql';

import { getDraftUrl_vicc5Leaderboard } from './__generated__/getDraftUrl.graphql';

export const getDraftUrl = withFragments(
  (vicc5Leaderboard: getDraftUrl_vicc5Leaderboard) => {
    const {
      vicc5League: { vicc5Leaderboards },
    } = vicc5Leaderboard;

    const leaderboardWithCampaign = vicc5Leaderboards.find(
      l => l.commonDraftCampaign
    );

    const slug = { leaderboardWithCampaign };

    if (!slug) {
      return '';
    }

    return generatePath(FOOTBALL_DRAFT, {
      slug: leaderboardWithCampaign?.slug,
    });
  },
  {
    vicc5Leaderboard: gql`
      fragment getDraftUrl_vicc5Leaderboard on Vicc5Leaderboard {
        slug
        vicc5League {
          slug
          vicc5Leaderboards {
            slug
            commonDraftCampaign {
              slug
            }
          }
        }
      }
    ` as TypedDocumentNode<getDraftUrl_vicc5Leaderboard>,
  }
);
