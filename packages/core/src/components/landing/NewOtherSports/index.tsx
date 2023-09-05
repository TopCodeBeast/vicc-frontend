import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Text20 } from '@core/atoms/typography';
import {
  desktopAndAbove,
  laptopAndAbove,
  tabletAndAbove,
} from '@core/style/mediaQuery';

import { BaseballContent } from './BaseballContent';
import { FootballContent } from './FootballContent';
import { NBAContent } from './NBAContent';

const messages = defineMessages({
  title: {
    id: 'Landing.NewOtherSports.title',
    defaultMessage: 'Choose your sport',
  },
  mlb: {
    id: 'Landing.NewOtherSports.mlb',
    defaultMessage: 'Featuring all 30 MLB officially licensed clubs',
  },
  cricket: {
    id: 'Landing.NewOtherSports.football',
    defaultMessage: 'Featuring over 300 officially licensed football clubs',
  },
  nba: {
    id: 'Landing.NewOtherSports.nba',
    defaultMessage: 'Featuring all 30 NBA officially licensed teams',
  },
});

const Wrapper = styled.div``;

const Title = styled(Text20)`
  font-family: 'Druk Wide';
  text-transform: uppercase;
  margin-bottom: var(--triple-unit);

  @media ${tabletAndAbove} {
    font-size: 24px;
    margin-bottom: calc(var(--unit) * 7);
  }
  @media ${laptopAndAbove} {
    font-size: 28px;
    margin-bottom: calc(var(--unit) * 5);
  }
`;

const Grid = styled.div`
  display: grid;
  gap: var(--double-unit);
  grid-auto-flow: column;
  overflow: auto;
  grid-template-columns: repeat(3, minmax(320px, 1fr));

  @media ${tabletAndAbove} {
    grid-template-columns: repeat(3, minmax(440px, 1fr));
  }

  @media ${desktopAndAbove} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const NewOtherSports = () => {
  const { formatMessage } = useIntl();

  return (
    <Wrapper>
      <Title>{formatMessage(messages.title)}</Title>
      <Grid>
        <FootballContent />
        <NBAContent />
        <BaseballContent />
      </Grid>
    </Wrapper>
  );
};
