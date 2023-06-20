import { gql } from '@apollo/client';
import { useEffect } from 'react';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { FOOTBALL_COMPETITION_DETAILS_LEADERBOARD } from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { Link } from '@sorare/core/src/routing/Link';

import { UserGroupLeaderboard } from '@sorare/football/src/components/so5/Leaderboard/UserGroupLeaderboard';
import { LeaderboardWithLineupDetails as Leaderboard } from '@sorare/football/src/components/so5/Leaderboard/WithLineupDetails';
import { ShowMoreButton } from '@sorare/football/src/pages/Lobby/Components/ShowMoreButton';

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
    football {
      so5 {
        so5Leaderboard(slug: $slug) {
          slug
          so5League {
            slug
          }
          mySo5Rankings {
            id
            ...Leaderboard_so5Rankings
          }
          universalSo5UserGroups {
            slug
            ...UserGroupLeaderboard_so5Memberships
          }
          so5LineupsCount
          so5Rankings(first: 5, onlyFollowed: $onlyFollowed) {
            nodes {
              id
              ...Leaderboard_so5Rankings
            }
          }
        }
      }
    }
  }
  ${Leaderboard.fragments.so5Ranking}
  ${UserGroupLeaderboard.fragments.so5Memberships}
`;

export const LeaderboardFetcher = ({
  leaderboardSlug = '',
  onlyFollowed = false,
  leaderboardMode,
}: Props) => {
  const { formatMessage } = useIntlContext();
  const { data, refetch } = useQuery<
    LobbyLeaderboardsFetcherQuery,
    LobbyLeaderboardsFetcherQueryVariables
  >(LOBBY_LEADERBOARDS_FETCHER_QUERY, {
    variables: { slug: leaderboardSlug, onlyFollowed, page: 0 },
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
    skip: !leaderboardSlug,
  });

  const { football } = data || {};
  const { so5 } = football || {};
  const { so5Leaderboard } = so5 || {};
  const {
    mySo5Rankings,
    so5Rankings,
    so5LineupsCount,
    universalSo5UserGroups,
  } = so5Leaderboard || {};

  const globalRanking =
    universalSo5UserGroups?.[0]?.membershipsPaginated?.memberships?.slice(0, 5);
  const myGlobalRanking = universalSo5UserGroups?.[0]?.myMembership;

  useEffect(() => {
    refetch();
  }, [refetch, leaderboardSlug]);

  return (
    <Root>
      {!(
        so5Leaderboard &&
        mySo5Rankings &&
        so5Rankings &&
        typeof so5LineupsCount === 'number'
      ) ? (
        <LoaderWrapper>
          <LoadingIndicator />
        </LoaderWrapper>
      ) : (
        <Container>
          <LeaderboardWrapper>
            {leaderboardMode === 'overall' ? (
              <UserGroupLeaderboard
                memberships={globalRanking}
                myMembership={myGlobalRanking}
              />
            ) : (
              <Leaderboard
                rankings={so5Rankings.nodes}
                myRanking={mySo5Rankings[0]}
                onlyFollowed={onlyFollowed}
              />
            )}
            {!!so5Rankings.nodes?.length && (
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
