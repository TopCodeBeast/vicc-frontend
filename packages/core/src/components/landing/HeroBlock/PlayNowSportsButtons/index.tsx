import { defineMessages, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import mlbLogoSrc from '@core/assets/logos/mlb/mlb.svg';
import mlbpaLogoSrc from '@core/assets/logos/mlb/mlbpa.svg';
import nbaLogoSrc from '@core/assets/logos/nba/nba.svg';
import nbpaLogoSrc from '@core/assets/logos/nba/nbpa.svg';
import Button from '@core/atoms/buttons/Button';
import { SorareLogo } from '@core/atoms/icons/SorareLogo';
import SmallerStarBall from '@core/atoms/navigation/SmallerStarBall';
import { Text18 } from '@core/atoms/typography';
import { ContentContainer } from '@core/components/landing/NewLandingMultiSport/ui';
import { FOOTBALL_PATH, MLB_PATH, NBA_PATH } from '@core/constants/routes';
import { sportsLabelsMessages } from '@core/lib/glossary';
import { laptopAndAbove, tabletAndAbove } from '@core/style/mediaQuery';
import { hideScrollbar } from '@core/style/utils';

import playNowBaseball from './assets/playNowBaseball.jpg';
import playNowFootball from './assets/playNowFootball.jpg';
import playNowNBA from './assets/playNowNBA.jpg';

const messages = defineMessages({
  cta: {
    id: 'Landing.Hero.PlayNowBanner.cta',
    defaultMessage: 'Play now',
  },
});

const Wrapper = styled(ContentContainer)`
  ${hideScrollbar}
  z-index: 1;
  display: grid;
  position: relative;
  overflow: auto;
  gap: var(--unit);
  grid-auto-flow: column;
  margin: var(--double-and-a-half-unit) auto
    calc(var(--double-and-a-half-unit) * 3) auto;
  grid-template-columns: repeat(3, minmax(320px, 1fr));

  @media ${tabletAndAbove} {
    margin: var(--double-and-a-half-unit) auto
      calc(var(--double-and-a-half-unit) * 2) auto;
  }
  @media ${laptopAndAbove} {
    margin: var(--double-and-a-half-unit) auto;
  }
`;

const PlayNowButton = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  justify-content: space-between;
  border-radius: var(--intermediate-unit);
  padding: var(--double-unit) var(--intermediate-unit);

  &:hover {
    opacity: 0.9;
  }
`;

const SorareWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StarBall = styled(SmallerStarBall)`
  width: 16px;
  height: 16px;
  margin-right: var(--half-unit);
`;

const SmallSorareLogo = styled(SorareLogo)`
  width: 50px;
`;

const Title = styled(Text18)`
  text-transform: uppercase;
  font-family: 'Druk Wide';
  margin-bottom: var(--unit);
`;

const LogosWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 10px;
  background-color: var(--c-static-neutral-100);
`;

export const PlayNowSportsButtons = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const SorareLogoWithStarball = () => (
    <SorareWrapper>
      <StarBall />
      <SmallSorareLogo />
    </SorareWrapper>
  );

  return (
    <Wrapper>
      <PlayNowButton
        style={{
          backgroundImage: `url(${playNowFootball})`,
        }}
        onClick={() => navigate(FOOTBALL_PATH)}
      >
        <div>
          <Title>{formatMessage(sportsLabelsMessages[Sport.FOOTBALL])}</Title>
          <SorareLogoWithStarball />
        </div>
        <Button color="white" small>
          {formatMessage(messages.cta)}
        </Button>
      </PlayNowButton>
      <PlayNowButton
        style={{
          backgroundImage: `url(${playNowNBA})`,
        }}
        onClick={() => navigate(NBA_PATH)}
      >
        <div>
          <Title>{formatMessage(sportsLabelsMessages[Sport.NBA])}</Title>
          <LogosWrapper>
            <SorareLogoWithStarball />
            <VerticalDivider />
            <img src={nbaLogoSrc} height={16} alt="NBA" />
            <VerticalDivider />
            <img src={nbpaLogoSrc} height={13} alt="NBPA" />
          </LogosWrapper>
        </div>
        <Button color="white" small>
          {formatMessage(messages.cta)}
        </Button>
      </PlayNowButton>
      <PlayNowButton
        style={{
          backgroundImage: `url(${playNowBaseball})`,
        }}
        onClick={() => navigate(MLB_PATH)}
      >
        <div>
          <Title>{formatMessage(sportsLabelsMessages[Sport.BASEBALL])}</Title>
          <LogosWrapper>
            <SorareLogoWithStarball />
            <VerticalDivider />
            <img src={mlbLogoSrc} width={20} alt="MLB" />
            <VerticalDivider />
            <img src={mlbpaLogoSrc} width={55} alt="MLBPA" />
          </LogosWrapper>
        </div>
        <Button color="white" small>
          {formatMessage(messages.cta)}
        </Button>
      </PlayNowButton>
    </Wrapper>
  );
};
