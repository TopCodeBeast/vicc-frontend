import { TypedDocumentNode, gql } from '@apollo/client';
import { generatePath } from 'react-router-dom';

import { FOOTBALL_DRAFT } from '@sorare/core/src/constants/routes';
import { withFragments } from '@sorare/core/src/lib/gql';

import { getDraftUrl_so5Leaderboard } from './__generated__/getDraftUrl.graphql';

export const getDraftUrl = withFragments(
  (so5Leaderboard: getDraftUrl_so5Leaderboard) => {
    const {
      so5League: { so5Leaderboards },
    } = so5Leaderboard;

    const leaderboardWithCampaign = so5Leaderboards.find(
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
    so5Leaderboard: gql`
      fragment getDraftUrl_so5Leaderboard on So5Leaderboard {
        slug
        so5League {
          slug
          so5Leaderboards {
            slug
            commonDraftCampaign {
              slug
            }
          }
        }
      }
    ` as TypedDocumentNode<getDraftUrl_so5Leaderboard>,
  }
);
