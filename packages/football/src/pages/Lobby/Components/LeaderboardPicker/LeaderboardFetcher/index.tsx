import { TypedDocumentNode, gql } from '@apollo/client';
import { useEffect } from 'react';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { FOOTBALL_COMPETITION_DETAILS_LEADERBOARD } from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { Link } from '@sorare/core/src/routing/Link';

import { LeaderboardWithLineupDetails } from '@football/components/so5/Leaderboard/WithLineupDetails';
import Leaderboard from '@football/components/userGroup/UserGroupLeaderboard';
import { ShowMoreButton } from '@football/pages/Lobby/Components/ShowMoreButton';

import {
  LobbyLeaderboardsFetcherQuery,
  LobbyLeaderboardsFetcherQueryVariables,
} from './__generated__/index.graphql';

interface Props {
  leaderboardSlug?: string;
  onlyFollowed?: boolean;
  leaderboardMode?: 'overall' | 'matchday';
}

const Root = styled.section`
  background: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  isolation: isolate;
`;
const LoaderWrapper = styled.div`
  margin: var(--unit) 0;
`;
const LeaderboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const Container = styled.article`
  margin: 0 auto;
`;

const LOBBY_LEADERBOARDS_FETCHER_QUERY = gql`
  query LobbyLeaderboardsFetcherQuery(
    $slug: String!
    $onlyFollowed: Boolean
    $page: Int!
  ) {
    #football {
      vicc5 {
        vicc5Leaderboard(slug: $slug) {
          slug
          vicc5League {
            slug
          }
          myVicc5Rankings {
            id
            ...Leaderboard_vicc5Rankings
          }
          universalVicc5UserGroups {
            slug
            ...Leaderboard_vicc5Memberships
          }
          vicc5LineupsCount
          vicc5Rankings(first: 5, onlyFollowed: $onlyFollowed) {
            nodes {
              id
              ...Leaderboard_vicc5Rankings
            }
          }
        }
      }
    #}
  }
  ${LeaderboardWithLineupDetails.fragments.vicc5Ranking}
  ${Leaderboard.fragments.vicc5Memberships}
` as TypedDocumentNode<
  LobbyLeaderboardsFetcherQuery,
  LobbyLeaderboardsFetcherQueryVariables
>;

export const LeaderboardFetcher = ({
  leaderboardSlug = '',
  onlyFollowed = false,
  leaderboardMode,
}: Props) => {
  const { formatMessage } = useIntlContext();
  const { data, refetch } = useQuery(LOBBY_LEADERBOARDS_FETCHER_QUERY, {
    variables: { slug: leaderboardSlug, onlyFollowed, page: 0 },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
    skip: !leaderboardSlug,
  });

  const { football } = data || {};
  const { vicc5 } = football || {};
  const { vicc5Leaderboard } = vicc5 || {};
  const {
    myVicc5Rankings,
    vicc5Rankings,
    vicc5LineupsCount,
    universalVicc5UserGroups,
  } = vicc5Leaderboard || {};

  const globalRanking =
    universalVicc5UserGroups?.[0]?.membershipsPaginated?.memberships?.slice(0, 5);
  const myGlobalRanking = universalVicc5UserGroups?.[0]?.myMembership;

  useEffect(() => {
    refetch();
  }, [refetch, leaderboardSlug]);

  return (
    <Root>
      {!(
        vicc5Leaderboard &&
        myVicc5Rankings &&
        vicc5Rankings &&
        typeof vicc5LineupsCount === 'number'
      ) ? (
        <LoaderWrapper>
          <LoadingIndicator />
        </LoaderWrapper>
      ) : (
        <Container>
          <LeaderboardWrapper>
            {leaderboardMode === 'overall' ? (
              <Leaderboard
                memberships={globalRanking}
                myMembership={myGlobalRanking}
              />
            ) : (
              <LeaderboardWithLineupDetails
                rankings={vicc5Rankings.nodes}
                myRanking={myVicc5Rankings[0]}
                onlyFollowed={onlyFollowed}
              />
            )}
            {!!vicc5Rankings.nodes?.length && (
              <ShowMoreButton
                component={Link}
                to={generatePath(FOOTBALL_COMPETITION_DETAILS_LEADERBOARD, {
                  competition: leaderboardSlug,
                })}
                moreText={formatMessage({
                  id: 'LobbyLeaderboards.ShowMore',
                  defaultMessage: 'Show more',
                })}
              />
            )}
          </LeaderboardWrapper>
        </Container>
      )}
    </Root>
  );
};
