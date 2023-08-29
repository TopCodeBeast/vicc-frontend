import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { MLB_TEAM, NBA_TEAM } from '@sorare/core/src/constants/routes';
// import { MLBTeams } from '@sorare/core/src/lib/mlbTeams';
import { Baseball } from '@sorare/core/src/routing/MultiSportAppBar/Sport/Baseball';
import { NBA } from '@sorare/core/src/routing/MultiSportAppBar/Sport/NBA';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { Header } from '../Header';
import { Item } from '../Item';
import StickySectionTitle from '../StickySectionTitle';

const ClubsList = styled.div`
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

const SectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

type Props = {
  clubs: any;
  sport: Sport.NBA | Sport.BASEBALL;
};

const CLUBS_USING_MONOCHROME_LOGO = ['utah-jazz'];

export const USSportClubs = ({ clubs, sport }: Props) => {
  const [searchValue, setSearchValue] = useState('');

  const { formatMessage } = useIntl();
  const clubsToDisplay = useMemo(() => {
    const result = searchValue.trim()
      ? clubs
          ?.filter(club =>
            club.fullName.toLowerCase().includes(searchValue.toLowerCase())
          )
          .sort((a, b) => a.fullName.localeCompare(b.fullName))
      : clubs.sort((a, b) => a.fullName.localeCompare(b.fullName));
    return result;
  }, [clubs, searchValue]);
  return (
    <>
      <Header
        onSearchInputChange={setSearchValue}
        searchPlaceholder={
          sport === Sport.NBA
            ? formatMessage({
                id: 'LicensedClubs.nbaSearch',
                defaultMessage: 'Search for an NBA team',
              })
            : formatMessage({
                id: 'LicensedClubs.mlbSearch',
                defaultMessage: 'Search for an MLB team',
              })
        }
      />
      <>
        <StickySectionTitle href={`#${sport}`}>
          <SectionTitleWrapper>
            {sport === Sport.BASEBALL ? <Baseball /> : <NBA />}
          </SectionTitleWrapper>
        </StickySectionTitle>
        <ClubsList id={sport}>
          {clubsToDisplay.map(club => (
            <Item
              key={club.slug}
              name={club.fullName}
              logoUrl={
                CLUBS_USING_MONOCHROME_LOGO.includes(club.slug)
                  ? club.monochromeSvgUrl
                  : club.svgUrl || ''
              }
              to={
                sport === Sport.BASEBALL
                  ? generatePath(MLB_TEAM, { slug: club.slug })
                  : generatePath(NBA_TEAM, { slug: club.slug })
              }
            />
          ))}
        </ClubsList>
      </>
    </>
  );
};
