import { gql } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Vicc5Tournament as So5Tournament } from '@sorare/core/src/__generated__/globalTypes';
import Container from '@sorare/core/src/atoms/layout/Container';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Title4 } from '@sorare/core/src/atoms/typography';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import { useUseCustomLists } from '@sorare/core/src/lib/featureFlags';
import { fantasy } from '@sorare/core/src/lib/glossary';
import {
  laptopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { Lineup } from '@football/components/lineup/Lineup';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import { RewardType } from '@football/lib/lineupRewards';
// import HighlightedCards from '@football/pages/Gallery/HighlightedCards';

// import ClubHonorsSummaryByLeaderboard from './ClubHonorsSummaryByLeaderboard';
// import EmptyState from './EmptyState';
// import ClubHonorsSummary from './Summary';
import {
  ClubHonorsLineupsQuery,
  ClubHonorsSummariesQuery,
} from './__generated__/index.graphql';

interface Props {
  user: { slug: string };
  readOnly: boolean;
}

const Root = styled(Container)`
  background: var(--c-neutral-100);
`;
const FlexColContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  flex: 1;
`;
const Lineups = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  gap: var(--double-unit);
  min-height: 280px;
  @media ${tabletAndAbove} {
    grid-template-columns: repeat(2, 1fr);
  }
  @media ${laptopAndAbove} {
    grid-template-columns: repeat(3, 1fr);
  }
`;
const Title = styled(Title4)`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
const LeaderboardLogo = styled.img`
  width: 32px;
  height: 32px;
`;
const EmptyBlock = styled.div`
  background-color: var(--c-neutral-200);
  border-radius: var(--double-unit);
  opacity: 0.23;
`;
const EmptyBlocks = () => (
  <>
    <EmptyBlock />
    <EmptyBlock />
    <EmptyBlock />
  </>
);

const atLeastOneReward = ({
  limited,
  rare,
  superRare,
  unique,
  customSeries,
  top1,
  top2,
  top3,
}: {
  limited: number;
  rare: number;
  superRare: number;
  unique: number;
  customSeries: number;
  top1: number;
  top2: number;
  top3: number;
}) =>
  limited + rare + superRare + unique + customSeries + top1 + top2 + top3 > 0;

const CLUB_HONORS_SUMMARIES_QUERY = gql`
  query ClubHonorsSummariesQuery($slug: String!) {
    user(slug: $slug) {
      slug
      #...ClubHonorsSummary_user
      #...ClubHonorsSummaryByLeaderboard_user
      #...HighlightedCards_user
    }
  }
  #{ClubHonorsSummary.fragments.user}
  #{ClubHonorsSummaryByLeaderboard.fragments.user}
  #{HighlightedCards.fragments.user}
`;

const CLUB_HONORS_LINEUPS_QUERY = gql`
  query ClubHonorsLineupsQuery(
    $slug: String!
    $vicc5LeaderboardType: Vicc5LeaderboardType
    $cursor: String
  ) {
    user(slug: $slug) {
      slug
      rewardedRankings(
        after: $cursor
        first: 12
        vicc5LeaderboardType: $vicc5LeaderboardType
      ) {
        nodes {
          id
          so5Lineup: vicc5Lineup {
            id
            ...Lineup_so5Lineup
          }
          so5Leaderboard: vicc5Leaderboard {
            slug
            ...Lineup_so5Leaderboard
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${Lineup.fragments.so5Leaderboard}
  ${Lineup.fragments.so5Lineup}
`;

const ClubHonors = ({ user: { slug }, readOnly }: Props) => {
  const useCustomLists = useUseCustomLists();
  const [selectedLeaderboard, setSelectedLeaderboard] =
    useState<So5Tournament | null>(null);
  const { data: summariesData, loading } = useQuery<ClubHonorsSummariesQuery>(
    CLUB_HONORS_SUMMARIES_QUERY,
    {
      variables: {
        slug,
      },
    }
  );
  const { data: lineupsData, loadMore } =
    usePaginatedQuery<ClubHonorsLineupsQuery>(CLUB_HONORS_LINEUPS_QUERY, {
      variables: {
        slug,
        so5LeaderboardType: selectedLeaderboard?.vicc5LeaderboardType,
      },
      skip: readOnly,
      connection: 'So5RankingConnection',
    });

  const { endCursor, hasNextPage } =
    lineupsData?.user.rewardedRankings.pageInfo || {};
  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, { cursor: endCursor });
    }, [endCursor, loadMore]),
    !!hasNextPage
  );

  const leaderboards = useMemo(() => {
    if (!summariesData) {
      return [];
    }
    return []//[...summariesData.user.trophies]
      .sort((a, b) => {
        if (a.unique !== b.unique) {
          return b.unique - a.unique;
        }
        if (a.superRare !== b.superRare) {
          return b.superRare - a.superRare;
        }
        if (a.rare !== b.rare) {
          return b.rare - a.rare;
        }
        if (a.limited !== b.limited) {
          return b.limited - a.limited;
        }
        if (a.customSeries !== b.customSeries) {
          return b.customSeries - a.customSeries;
        }
        return a.so5TournamentType.displayName > b.so5TournamentType.displayName
          ? 1
          : -1;
      })
      .filter(cards => atLeastOneReward(cards));
  }, [summariesData]);

  return (
    <Root>
      <>ClubHonors565656</>
      {/* {loading ? (
        <LoadingIndicator white />
      ) : (
        <FlexColContainer>
          {summariesData?.user && (
            <>
              {!useCustomLists && (
                <HighlightedCards
                  user={summariesData.user}
                  readOnly={readOnly}
                />
              )}
              {leaderboards.length > 0 && (
                <>
                  <Title color="var(--c-neutral-1000)">
                    <FormattedMessage
                      id="ClubHonors.ClubHonors"
                      defaultMessage="Club Honors"
                    />
                  </Title>
                  {leaderboards.length > 1 && (
                    <ClubHonorsSummary user={summariesData.user} />
                  )}
                  <ClubHonorsSummaryByLeaderboard
                    onSelectLeaderboard={setSelectedLeaderboard}
                    selectedLeaderboard={selectedLeaderboard}
                    leaderboards={leaderboards}
                  />
                </>
              )}
            </>
          )}
          {leaderboards.length > 0 ? (
            <>
              {selectedLeaderboard ? (
                <Title color="var(--c-neutral-1000)">
                  <LeaderboardLogo
                    src={selectedLeaderboard.svgLogoUrl}
                    alt={selectedLeaderboard.displayName}
                  />
                  <FormattedMessage
                    id="ClubHonors.LineupsUsed"
                    defaultMessage="Lineups {leaderboard}"
                    values={{ leaderboard: selectedLeaderboard.displayName }}
                  />
                </Title>
              ) : (
                <Title color="var(--c-neutral-1000)">
                  <FormattedMessage {...fantasy.lineups} />
                </Title>
              )}
              <Lineups>
                {lineupsData?.user.rewardedRankings ? (
                  <>
                    {lineupsData.user.rewardedRankings.nodes.map(
                      ({ id, so5Lineup, so5Leaderboard }) => (
                        <Lineup
                          key={id}
                          lineup={so5Lineup}
                          leaderboard={so5Leaderboard}
                          rewardType={RewardType.Actual}
                          displayScore
                        />
                      )
                    )}
                  </>
                ) : (
                  <EmptyBlocks />
                )}
              </Lineups>
              <InfiniteScrollLoader />
            </>
          ) : (
            <EmptyState />
          )}
        </FlexColContainer>
      )} */}
    </Root>
  );
};

export default ClubHonors;
