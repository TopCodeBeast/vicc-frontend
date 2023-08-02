import { TypedDocumentNode, gql } from '@apollo/client';
import { useCallback } from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import styled from 'styled-components';

import { So5State } from '@sorare/core/src/__generated__/globalTypes';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Empty } from '@sorare/core/src/components/cards/Empty';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import {
  desktopAndAbove,
  laptopAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { Lineup } from '@football/components/lineup/Lineup';
import LineupToDiscover from '@football/components/lineup/LineupToDiscover';
import useNavigateToComposeTeam from '@football/hooks/so5/useNavigateToComposeTeam';
import { getRewardType } from '@football/lib/lineupRewards';
import { ShowMoreButton } from '@football/pages/Lobby/Components/ShowMoreButton';
import useGetRecommendedLeaderboard from '@football/pages/useGetRecommendedLeaderboard';

import { Teams_so5Fixture } from './__generated__/index.graphql';
import useGetTeams from './useGetTeams';

const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--triple-unit);
`;

const Lineups = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--double-unit);
  @media ${laptopAndAbove} {
    grid-template-columns: repeat(2, 1fr);
  }
  @media ${desktopAndAbove} {
    grid-template-columns: repeat(3, 1fr);
  }
`;
const LoadingBox = styled.div`
  padding: calc(var(--unit) * 10) 0;
`;

const messages = defineMessages({
  emptyTitle: {
    id: 'Lobby.Teams.Empty.title',
    defaultMessage: 'Quiet week',
  },
  emptyDescription: {
    id: 'Lobby.Teams.Empty.description',
    defaultMessage: "You didn't register any teams for this week",
  },
});

const lineupPaginationBaseLimit = 6;

type Props = {
  emptyDescription?: MessageDescriptor;
  queryVariables: {
    type: So5State | null;
    slug: string | null;
    endCursor?: string | null;
    so5FixtureId?: string | undefined;
    so5LeaderboardSlug?: string | null;
    withTraining?: boolean;
    draft?: boolean;
    limit?: number | null;
  };
  showRecommendedLeaderboard?: boolean;
  so5Fixture?: Teams_so5Fixture | null;
};

export const Teams = ({
  emptyDescription,
  queryVariables,
  showRecommendedLeaderboard,
  so5Fixture,
}: Props) => {
  const { formatMessage } = useIntlContext();

  const {
    recommendedLeaderboard,
    loading: recommendedLeaderboardLoading,
    draftedLeaderboard,
  } = useGetRecommendedLeaderboard({
    showRecommendedLeaderboard,
  });
  const displayRecommendedLeaderboard =
    !!recommendedLeaderboard && showRecommendedLeaderboard;

  const lineupPaginationLimit = displayRecommendedLeaderboard
    ? lineupPaginationBaseLimit - 1
    : lineupPaginationBaseLimit;

  const {
    data,
    loading: teamsLoading,
    loadMore,
  } = useGetTeams({
    ...queryVariables,
    limit: lineupPaginationLimit,
    endCursor: queryVariables.endCursor,
    startCursor: '',
  });

  const { edges, pageInfo } = data || {};
  const { hasNextPage, endCursor } = pageInfo || {};
  const lineups = edges?.map(edge => edge.node);
  const lineupsToShow = lineups?.filter(
    lineup => !queryVariables.draft || lineup?.draft
  );
  let alreadyfetched = lineupsToShow?.length || 0;
  if (displayRecommendedLeaderboard) {
    alreadyfetched += 1;
  }
  const restToFetch =
    lineupPaginationBaseLimit - (alreadyfetched % lineupPaginationBaseLimit);
  const loading = teamsLoading || recommendedLeaderboardLoading;
  const displayLineups = !!lineupsToShow?.length;

  const displayLineupsBlock = displayLineups || displayRecommendedLeaderboard;

  const loadMoreCallback = useCallback(() => {
    if (endCursor) {
      loadMore(false, {
        startCursor: endCursor,
        limit: lineupPaginationBaseLimit,
      });
    }
  }, [endCursor, loadMore]);
  const navigateToComposeTeam = useNavigateToComposeTeam();
  const { ref: refTriggeringInfiniteScroll } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, {
        // FIXME undefined case is improperly handled
        startCursor: endCursor ?? undefined,
        limit: restToFetch,
      });
    }, [loadMore, endCursor, restToFetch]),
    !!hasNextPage,
    teamsLoading
  );

  return (
    <Root>
      {loading && !displayLineups && (
        <LoadingBox>
          <LoadingIndicator />
        </LoadingBox>
      )}
      {displayLineupsBlock && (
        <Lineups>
          {displayRecommendedLeaderboard && !loading && (
            <LineupToDiscover
              leaderboard={recommendedLeaderboard}
              amateurDraftedLeaderboard={draftedLeaderboard}
              onPaymentSuccess={() => {
                navigateToComposeTeam({
                  leaderboardSlug: recommendedLeaderboard.slug,
                });
              }}
            />
          )}
          {lineupsToShow?.map(
            lineup =>
              lineup?.so5Leaderboard && (
                <Lineup
                  key={lineup.id}
                  leaderboard={lineup.so5Leaderboard}
                  lineup={lineup}
                  displayScore={queryVariables.type !== 'UPCOMING'}
                  rewardType={getRewardType(so5Fixture)}
                />
              )
          )}
        </Lineups>
      )}
      {hasNextPage && (
        <ShowMoreButton
          ref={
            (lineupsToShow?.length || 0) !== lineupPaginationLimit
              ? refTriggeringInfiniteScroll
              : null
          }
          moreText={
            loading ? (
              <LoadingIndicator small />
            ) : (
              <FormattedMessage
                id="Teams.more.teams"
                defaultMessage="Show more teams"
              />
            )
          }
          onClick={loadMoreCallback}
        />
      )}
      {!lineups?.length && !loading && !displayRecommendedLeaderboard && (
        <Empty
          title={formatMessage(messages.emptyTitle)}
          description={formatMessage(
            emptyDescription || messages.emptyDescription
          )}
        />
      )}
    </Root>
  );
};
Teams.fragments = {
  so5Fixture: gql`
    fragment Teams_so5Fixture on So5Fixture {
      slug
      ...getRewardType_so5Fixture
    }
    ${getRewardType.fragments.so5Fixture}
  ` as TypedDocumentNode<Teams_so5Fixture>,
};

export default Teams;
