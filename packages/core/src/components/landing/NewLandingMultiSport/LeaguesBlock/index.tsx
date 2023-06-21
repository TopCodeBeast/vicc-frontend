import { faArrowDownLong, faPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { defineMessages, useIntl } from 'react-intl';
import { generatePath } from 'react-router-dom';
import styled from 'styled-components';

import premierLeague from '@core/assets/logos/football/EPL.svg';
import mls from '@core/assets/logos/football/MLS.svg';
import bundesliga from '@core/assets/logos/football/bundesliga.svg';
import cinch from '@core/assets/logos/football/cinchPremiership-monochrome.svg';
import eredivisie from '@core/assets/logos/football/eredivisie-monochrome.svg';
import laLiga from '@core/assets/logos/football/laLiga.svg';
import serieA from '@core/assets/logos/football/serieA.svg';
import mlb from '@core/assets/logos/mlb/mlb.svg';
import nba from '@core/assets/logos/nba/nba.svg';
import { Text14, Text18 } from '@core/atoms/typography';
import { ContentContainer } from '@core/components/landing/NewLandingMultiSport/ui';
import { messages as globalMessages } from '@core/components/landing/NewLandingMultiSport/utils';
import { LICENSED_PARTNERS_FOOTBALL_TAB } from '@core/constants/routes';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { theme } from '@core/style/theme';

const messages = defineMessages({
  moreLeagues: {
    id: 'Landing.LeaguesBlock.Moreleagues',
    defaultMessage: 'More leagues',
  },
});

const Wrapper = styled.div``;

const LeagueWrapper = styled(ContentContainer)`
  position: relative;
  display: grid;
  gap: var(--unit);
  grid-auto-flow: column;
  grid-template-columns: repeat(10, calc(var(--unit) * 14));
  margin: calc(var(--unit) * 5) 0;
  z-index: 1;
  overflow: auto;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    margin: var(--double-unit) auto auto auto;
    grid-template-columns: repeat(10, calc(var(--unit) * 15));
  }
`;

const LeagueLogo = styled.img`
  height: calc(var(--unit) * 7);
  max-width: calc(var(--unit) * 7);
`;

const LeagueBlock = styled.div`
  width: 100%;
  padding: var(--double-unit);
  border-radius: var(--unit);
  background: rgba(255, 255, 255, 0.07);
  text-align: center;
`;

const MoreLeaguesLink = styled(LeagueBlock)`
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
  color: var(--c-neutral-100);

  &:hover {
    opacity: 0.8;
    color: var(--c-neutral-100);
  }

  &:visited {
    color: var(--c-neutral-100);
  }
`;

const LeagueName = styled(Text14)`
  line-height: 1.15;
  margin-top: var(--intermediate-unit);
`;

const MoreLeaguesIcon = styled.div`
  background: black;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(var(--unit) * 7);
  width: calc(var(--unit) * 7);
  margin: auto;
`;
const CTAWrapper = styled(ContentContainer)`
  display: flex;
  gap: var(--double-and-a-half-unit);
  justify-content: space-between;
  padding-top: calc(var(--unit) * 7);
  padding-bottom: var(--quadruple-unit);
  position: relative;
  border-bottom: 1px solid var(--c-neutral-700);
`;

const ScrollDown = styled.div`
  display: flex;
  align-items: center;
  gap: var(--double-unit);
  padding-right: var(--quadruple-unit);
`;

export const LeaguesBlock = () => {
  const { formatMessage } = useIntl();
  const { up: isTabletOrDesktop } = useScreenSize('tablet');
  const leagues = [
    {
      name: 'Premier League',
      logo: premierLeague,
    },
    {
      name: 'NBA',
      logo: nba,
    },
    {
      name: 'MLB',
      logo: mlb,
    },
    {
      name: 'LaLiga Santander',
      logo: laLiga,
    },
    {
      name: 'Bundesliga',
      logo: bundesliga,
    },
    {
      name: 'Serie A',
      logo: serieA,
    },
    {
      name: 'Major League Soccer',
      logo: mls,
    },
    {
      name: 'Eredivisie',
      logo: eredivisie,
    },
    {
      name: 'Cinch Premiership',
      logo: cinch,
    },
  ];

  return (
    <Wrapper>
      {!isTabletOrDesktop && (
        <CTAWrapper>
          <Text18 color="var(--c-static-neutral-500)">
            {formatMessage(globalMessages.ScrollDownCTA)}
          </Text18>
          <ScrollDown>
            <FontAwesomeIcon icon={faArrowDownLong} />
          </ScrollDown>
        </CTAWrapper>
      )}
      <LeagueWrapper>
        {leagues.map(({ name, logo }) => (
          <LeagueBlock key={name}>
            <LeagueLogo src={logo} alt={name} />
            <LeagueName>{name}</LeagueName>
          </LeagueBlock>
        ))}
        <MoreLeaguesLink
          as="a"
          target="_blank"
          rel="noreferrer"
          href={generatePath(LICENSED_PARTNERS_FOOTBALL_TAB, {
            tab: 'competitions',
          })}
        >
          <MoreLeaguesIcon>
            <FontAwesomeIcon icon={faPlus} />
          </MoreLeaguesIcon>
          <LeagueName>{formatMessage(messages.moreLeagues)}</LeagueName>
        </MoreLeaguesLink>
      </LeagueWrapper>
    </Wrapper>
  );
};
