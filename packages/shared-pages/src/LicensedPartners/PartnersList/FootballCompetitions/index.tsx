import { TypedDocumentNode, gql } from '@apollo/client';
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text20 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_LEAGUE_SHOW } from '@sorare/core/src/constants/routes';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { flagUrl } from '@sorare/core/src/lib/territories';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { FootballTabs } from '../FootballTabs';
import { Header } from '../Header';
import { Item } from '../Item';
import StickySectionTitle from '../StickySectionTitle';
import {
  FootballCompetitionQuery,
  FootballCompetitionQueryVariables,
} from './__generated__/index.graphql';
import sortCompetition from './sortCompetition';

const LeagueName = styled(Text20)`
  white-space: nowrap;
`;
const CompetitionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding-top: var(--double-unit);
  @media ${tabletAndAbove} {
    grid-template-columns: repeat(4, 1fr);
    margin-left: 270px;
    margin-top: -100px;
    padding-top: 0;
  }
  margin-bottom: var(--quadruple-unit);
  gap: var(--double-unit);
`;

const FOOTBALL_COMPETITIONS_QUERY = gql`
  query FootballCompetitionQuery {
    #football {
      leaguesOpenForGameStats {
        slug
        displayName
        pictureUrl
        released
        country {
          slug
        }
      }
    #}
  }
` as TypedDocumentNode<
  FootballCompetitionQuery,
  FootballCompetitionQueryVariables
>;

export const FootballCompetitions = () => {
  const [searchValue, setSearchValue] = useState('');

  const { formatMessage } = useIntl();

  const { data, loading } = useQuery(FOOTBALL_COMPETITIONS_QUERY);

  const competitions = data?.football?.leaguesOpenForGameStats;

  const competitionsToDisplay = useMemo(() => {
    if (searchValue.trim()) {
      return competitions
        ?.filter(
          c =>
            c.displayName.toLowerCase().includes(searchValue.toLowerCase()) ||
            c.slug.includes(searchValue.toLowerCase())
        )
        .sort(sortCompetition);
    }
    return [...(competitions || [])].sort(sortCompetition);
  }, [competitions, searchValue]);

  return (
    <>
      <Header
        onSearchInputChange={setSearchValue}
        searchPlaceholder={formatMessage({
          id: 'LicensedClubs.footballCompetitionSearch',
          defaultMessage: 'Search for a competition',
        })}
      >
        <FootballTabs />
      </Header>
      <StickySectionTitle href="#competition">
        <LeagueName>
          <FormattedMessage
            id="LicensedClubs.FootballCompetitions.competitions"
            defaultMessage="Competitions Coverage"
          />
        </LeagueName>
      </StickySectionTitle>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <CompetitionsList id="competition">
          {competitionsToDisplay?.map(competition => {
            return (
              <Item
                key={competition.slug}
                name={competition.displayName}
                to={generatePath(FOOTBALL_LEAGUE_SHOW, {
                  slug: competition.slug,
                })}
                logoUrl={
                  competition.pictureUrl
                    ? competition.pictureUrl
                    : flagUrl({ country: competition.country })
                }
              />
            );
          })}
        </CompetitionsList>
      )}
    </>
  );
};
