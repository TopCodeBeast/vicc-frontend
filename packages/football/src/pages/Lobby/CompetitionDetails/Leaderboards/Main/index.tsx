import { useLazyQuery } from '@apollo/client';
import { ComponentType, useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import Pagination from '@sorare/core/src/atoms/navigation/Pagination';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import usePrevious from '@sorare/core/src/hooks/usePrevious';
import useToggle from '@sorare/core/src/hooks/useToggle';

import { LeaderboardWithLineupDetails as Leaderboard } from '@football/components/so5/Leaderboard/WithLineupDetails';
import ManagersCount from '@football/pages/Lobby/CompetitionDetails/Leaderboards/ManagersCount';
import {
  CompetitionDetailsLeaderboardTabQuery,
  CompetitionDetailsLeaderboardTabQueryVariables,
} from '@football/pages/Lobby/CompetitionDetails/Leaderboards/__generated__/queries.graphql';
import { COMPETITION_DETAILS_LEADERBOARD_TAB_QUERY } from '@football/pages/Lobby/CompetitionDetails/Leaderboards/queries';

const PAGE_SIZE = 10;

const FlexColContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const PaginationStyled = styled.footer`
  position: relative;
  display: inline-flex;
  align-self: center;
  margin-top: var(--double-unit);
`;
const Loader = styled.footer`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: var(--unit);
`;

type Props = {
  page: string | undefined;
  setPage: (p: { page: string | undefined }) => void;
  Header: ComponentType;
  so5LeaderboardSlug?: string;
  so5UserGroupSlug?: string;
};

const MainLeaderboard = ({
  page,
  setPage,
  Header,
  so5LeaderboardSlug,
  so5UserGroupSlug,
}: Props) => {
  const { competition = so5LeaderboardSlug } = useParams();

  const [onlyFollowed, toggleOnlyFollowed] = useToggle(false);
  const toggleFollowed = () => {
    toggleOnlyFollowed();
    setPage({ page: undefined });
  };
  const setQueryVariables = useCallback(
    (p: string | undefined) => {
      const variables = {
        slug: competition || '',
        pageSize: PAGE_SIZE,
        onlyFollowed,
        so5UserGroupSlug,
      };

      if (!p) return { variables };
      return {
        variables: {
          ...variables,
          page: +p - 1,
        },
      };
    },
    [competition, onlyFollowed, so5UserGroupSlug]
  );
  const [loadResults, { loading, data }] = useLazyQuery<
    CompetitionDetailsLeaderboardTabQuery,
    CompetitionDetailsLeaderboardTabQueryVariables
  >(COMPETITION_DETAILS_LEADERBOARD_TAB_QUERY, setQueryVariables(page));

  const prevData = usePrevious(data);
  const currentData = data || prevData;
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadResults(setQueryVariables(page));
  }, [loadResults, setQueryVariables, page]);

  if (!currentData) {
    return <LoadingIndicator grow />;
  }

  const { mySo5Rankings, so5RankingsPaginated, so5LineupsCount } =
    currentData.football.so5.so5Leaderboard;
  const { currentPage, so5Rankings, totalCount } = so5RankingsPaginated || {};
  const idFromQS = searchParams.get('id');

  const correspondingSo5Ranking = idFromQS
    ? mySo5Rankings.find(
        ({ so5Lineup }) => idFromObject(so5Lineup.id) === idFromQS
      )
    : mySo5Rankings[0];

  return (
    <FlexColContainer>
      <Header>
        <Checkbox
          checked={onlyFollowed}
          onChange={toggleFollowed}
          label={
            <FormattedMessage
              id="CompetitionDetailsLeaderboardsTab.friendsOnly"
              defaultMessage="Following only"
            />
          }
        />
        <ManagersCount count={so5LineupsCount} />
      </Header>
      <Leaderboard
        rankings={so5Rankings}
        myRanking={correspondingSo5Ranking}
        onlyFollowed={onlyFollowed}
      />
      <PaginationStyled>
        <Pagination
          currentPage={currentPage}
          pages={Math.ceil(totalCount / PAGE_SIZE)}
          onSelect={p => setPage({ page: `${p + 1}` })}
          inputPagination
        />
        {loading && (
          <Loader>
            <LoadingIndicator small />
          </Loader>
        )}
      </PaginationStyled>
    </FlexColContainer>
  );
};

export default MainLeaderboard;
