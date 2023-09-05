import { TypedDocumentNode, gql } from '@apollo/client';
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Vicc5LeaderboardRarity } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import Body from '@sorare/core/src/atoms/layout/Body';
import Container from '@sorare/core/src/atoms/layout/Container';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import {
  Text16,
  Text20,
  Title2,
  Title6,
} from '@sorare/core/src/atoms/typography';
import { FOOTBALL_LOBBY } from '@sorare/core/src/constants/routes';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import { groupBy, sortBy } from '@sorare/core/src/lib/arrays';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

// eslint-disable-next-line sorare/no-unrendered-component-imports
import LeaderboardRow from './LeaderboardRow';
import RarityFilter from './RarityFilter';
import {
  LobbyPrizePoolQuery,
  LobbyPrizePoolQueryVariables,
} from './__generated__/index.graphql';
import bannerBg from './assets/banner.png';

const Header = styled(Container)`
  background: url(${bannerBg});
  background-size: cover;
  background-position: center center;
  mask-image: linear-gradient(0deg, transparent 0%, black 10%);
  height: 160px;
  padding: var(--unit);
  @media ${tabletAndAbove} {
    align-items: flex-start;
  }
`;
const BackButtonWrapper = styled.div`
  padding-bottom: var(--double-unit);
`;
const Titles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  @media ${tabletAndAbove} {
    align-items: flex-start;
  }
`;
const StyledBody = styled(Body)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  gap: var(--quadruple-unit);
`;
const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const PrizePoolContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--unit);
`;
const Leaderboards = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

export const LOBBY_PRIZE_POOL_QUERY = gql`
  query LobbyPrizePoolQuery(
    $cursor: String
    $rarities: [Vicc5LeaderboardRarity!]
  ) {
    football {
      vicc5 {
        futureLeaderboardsPaginated(
          after: $cursor
          first: 50
          rarities: $rarities
        ) {
          nodes {
            slug
            startDate
            vicc5Fixture {
              slug
              shortDisplayName
            }
            ...LeaderboardRow_vicc5Leaderboard
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
  ${LeaderboardRow.fragments.vicc5Leaderboard}
` as TypedDocumentNode<LobbyPrizePoolQuery, LobbyPrizePoolQueryVariables>;

export const PrizePool = () => {
  const [rarities, setRarities] = useState<Vicc5LeaderboardRarity[]>([]);
  const { data, loading, loadMore } = usePaginatedQuery(
    LOBBY_PRIZE_POOL_QUERY,
    {
      variables: { rarities },
      nextFetchPolicy: 'cache-first',
      fetchPolicy: 'cache-and-network',
      connection: 'Vicc5LeaderboardConnection',
    }
  );

  const vicc5Leaderboards = data?.football.vicc5.futureLeaderboardsPaginated.nodes;
  const groupedVicc5Leaderboards = useMemo(
    () =>
      sortBy(
        element => element[0],
        Object.entries(
          groupBy(({ startDate }) => startDate, vicc5Leaderboards || [])
        )
      ),
    [vicc5Leaderboards]
  );

  const { InfiniteScrollLoader } = useInfiniteScroll(
    useCallback(() => {
      loadMore(false, {
        cursor:
          data?.football.vicc5.futureLeaderboardsPaginated?.pageInfo.endCursor,
      });
    }, [data?.football.vicc5.futureLeaderboardsPaginated, loadMore]),
    Boolean(
      data?.football.vicc5.futureLeaderboardsPaginated?.pageInfo?.hasNextPage
    ),
    loading
  );

  return (
    <StyledBody>
      <Header>
        <BackButtonWrapper>
          <Link to={FOOTBALL_LOBBY}>
            <Button medium color="white">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
          </Link>
        </BackButtonWrapper>
        <Titles>
          <Title2 color="var(--c-static-neutral-100)">
            <FormattedMessage
              id="Lobby.PrizePool.title"
              defaultMessage="Prize Pools"
            />
          </Title2>
          <Title6 color="var(--c-static-neutral-500)">
            <FormattedMessage
              id="Lobby.PrizePool.subtitle"
              defaultMessage="Explore upcoming competitions below to learn about prizes, rules, and how to enter"
            />
          </Title6>
        </Titles>
      </Header>
      <Container>
        <FilterContainer>
          <RarityFilter values={rarities} onChange={setRarities} />
        </FilterContainer>
        {loading ? (
          <PrizePoolContainer>
            <LoadingIndicator white />
          </PrizePoolContainer>
        ) : (
          <>
            <PrizePoolContainer>
              {groupedVicc5Leaderboards.map(([startDate, leaderboards]) => (
                <Fragment key={startDate}>
                  <FlexContainer>
                    <Text20 bold color="var(--c-neutral-600)">
                      <FormattedDate
                        value={startDate}
                        month="long"
                        day="numeric"
                      />
                    </Text20>
                    {leaderboards[0]?.vicc5Fixture && (
                      <Text16 bold color="var(--c-neutral-500)">
                        {leaderboards[0].vicc5Fixture.shortDisplayName}
                      </Text16>
                    )}
                  </FlexContainer>
                  <Leaderboards>
                    {leaderboards.map(leaderboard => (
                      <LeaderboardRow
                        key={leaderboard.slug}
                        vicc5Leaderboard={leaderboard}
                      />
                    ))}
                  </Leaderboards>
                </Fragment>
              ))}
            </PrizePoolContainer>
            <InfiniteScrollLoader />
          </>
        )}
      </Container>
    </StyledBody>
  );
};

export default PrizePool;
