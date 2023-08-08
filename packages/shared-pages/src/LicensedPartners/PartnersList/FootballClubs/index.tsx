import { TypedDocumentNode, gql } from '@apollo/client';
import { Fragment, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Text16, Text20 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_CLUB_SHOW } from '@sorare/core/src/constants/routes';
import { groupBy } from '@sorare/core/src/lib/arrays';
import { toDisplayName } from '@sorare/core/src/lib/territories';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import sortCompetition from '../FootballCompetitions/sortCompetition';
import { FootballTabs } from '../FootballTabs';
import { Header } from '../Header';
import { Item } from '../Item';
import StickySectionTitle from '../StickySectionTitle';
import { FootballClubs_club } from './__generated__/index.graphql';

const LeagueName = styled(Text20)`
  white-space: nowrap;
`;
const LeagueLogo = styled.img`
  height: 25px;
`;
const Country = styled(Text16)`
  display: flex;
  gap: var(--unit);
  align-items: center;
  color: var(--c-neutral-600);
  text-transform: capitalize;
`;

const ClubsPerLeague = styled.div`
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

type Props = {
  clubs: Nullable<FootballClubs_club[]>;
};

export const FootballClubs = ({ clubs }: Props) => {
  const [searchValue, setSearchValue] = useState('');

  const { formatMessage } = useIntl();

  const displayedClubs = useMemo(() => {
    let filteredClubs;
    if (searchValue.trim()) {
      filteredClubs = clubs?.filter(
        club =>
          club.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          club.code?.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      filteredClubs = clubs;
    }

    const grouped =
      filteredClubs &&
      groupBy(c => c.domesticLeague?.displayName || 'no-club', filteredClubs);

    return Object.entries(grouped || {})
      .sort(([, clubs1], [, clubs2]) =>
        sortCompetition(clubs1[0].domesticLeague, clubs2[0].domesticLeague)
      )
      .map(([, clubsList]) => clubsList);
  }, [clubs, searchValue]);

  return (
    <>
      <Header
        onSearchInputChange={setSearchValue}
        searchPlaceholder={formatMessage({
          id: 'LicensedClubs.footballSearch',
          defaultMessage: 'Search for a football team',
        })}
      >
        <FootballTabs />
      </Header>
      {displayedClubs.map(clubsList => {
        const league = clubsList[0].domesticLeague;
        if (!league) {
          return null;
        }
        return (
          <Fragment key={league.slug}>
            <StickySectionTitle href={`#${league.slug}`}>
              <LeagueLogo
                src={league.logoUrl || league.pictureUrl || ''}
                alt=""
              />
              <LeagueName>{league.displayName}</LeagueName>
              {league.country && (
                <Country>
                  <img src={league.country.flagUrl} alt="" width={16} />
                  {toDisplayName(league.country.code)}
                </Country>
              )}
            </StickySectionTitle>
            <ClubsPerLeague id={league.slug}>
              {clubsList.map(club => (
                <Item
                  key={club.slug}
                  name={club.name}
                  to={generatePath(FOOTBALL_CLUB_SHOW, {
                    slug: club.slug,
                  })}
                  logoUrl={club.pictureUrl || ''}
                />
              ))}
            </ClubsPerLeague>
          </Fragment>
        );
      })}
    </>
  );
};

FootballClubs.fragments = {
  club: gql`
    fragment FootballClubs_club on Club {
      slug
      name
      code
      pictureUrl
      domesticLeague {
        slug
        displayName
        pictureUrl
        logoUrl
        country {
          slug
          code
          flagUrl(size: 32)
        }
      }
    }
  ` as TypedDocumentNode<FootballClubs_club>,
};
